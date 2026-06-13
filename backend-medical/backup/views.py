import os
import subprocess
from pathlib import Path
from django.conf import settings
from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from accounts.permissions import IsAdminRole
from django.utils import timezone


def get_backup_dir():
    backup_dir = getattr(
        settings, 'DBBACKUP_STORAGE_OPTIONS', {}
    ).get('location', Path(settings.BASE_DIR) / 'backups')
    Path(backup_dir).mkdir(parents=True, exist_ok=True)
    return Path(backup_dir)


def parse_backup_file(filepath):
    stat = filepath.stat()
    size_mb = stat.st_size / (1024 * 1024)
    size_str = f"{size_mb:.1f} MB" if size_mb < 1024 else f"{size_mb/1024:.2f} GB"
    name = filepath.name
    btype = 'manual' if 'manual' in name else 'automatic'
    return {
        'id':          name,
        'name':        name,
        'type':        btype,
        'status':      'completed',
        'size':        size_str,
        'size_bytes':  stat.st_size,
        'date':        timezone.datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d'),
        'time':        timezone.datetime.fromtimestamp(stat.st_mtime).strftime('%H:%M:%S'),
        'location':    'local',
        'compression': name.endswith('.gz'),
        'created_at':  timezone.datetime.fromtimestamp(stat.st_mtime).isoformat(),
    }


# ============================================================
# GET /api/backup/  — Liste toutes les sauvegardes
# ============================================================
class BackupListView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        backup_dir = get_backup_dir()
        files = sorted(
            [f for f in backup_dir.iterdir() if f.is_file()],
            key=lambda f: f.stat().st_mtime,
            reverse=True
        )
        backups = [parse_backup_file(f) for f in files]
        return Response({'count': len(backups), 'backups': backups})


# ============================================================
# POST /api/backup/create/  — Crée une sauvegarde manuelle
# ============================================================
class BackupCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def post(self, request):
        backup_name = request.data.get('name', '').strip()
        compress    = request.data.get('compression', True)

        try:
            cmd = ['python', 'manage.py', 'dbbackup', '--noinput']
            if compress:
                cmd.append('--compress')

            result = subprocess.run(
                cmd, capture_output=True, text=True, cwd=settings.BASE_DIR
            )

            if result.returncode != 0:
                return Response({
                    'success': False,
                    'error': result.stderr or 'Erreur lors de la sauvegarde.'
                }, status=500)

            # Renommer si nom custom fourni
            backup_dir = get_backup_dir()
            files = sorted(
                [f for f in backup_dir.iterdir() if f.is_file()],
                key=lambda f: f.stat().st_mtime, reverse=True
            )
            if files and backup_name:
                latest   = files[0]
                ext      = ''.join(latest.suffixes)
                new_path = backup_dir / f"manual_{backup_name}{ext}"
                latest.rename(new_path)

            # Récupérer les infos du dernier fichier
            files = sorted(
                [f for f in backup_dir.iterdir() if f.is_file()],
                key=lambda f: f.stat().st_mtime, reverse=True
            )
            backup_data = parse_backup_file(files[0]) if files else {}

            return Response({
                'success': True,
                'message': 'Sauvegarde créée avec succès.',
                'backup':  backup_data,
            })

        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=500)


# ============================================================
# GET /api/backup/download/<filename>/  — Télécharger
# ============================================================
class BackupDownloadView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request, filename):
        backup_dir = get_backup_dir()
        filepath   = backup_dir / filename
        try:
            filepath.resolve().relative_to(backup_dir.resolve())
        except ValueError:
            return Response({'error': 'Accès non autorisé.'}, status=403)

        if not filepath.exists():
            return Response({'error': 'Fichier introuvable.'}, status=404)

        return FileResponse(open(filepath, 'rb'), as_attachment=True, filename=filename)


# ============================================================
# DELETE /api/backup/delete/<filename>/  — Supprimer
# ============================================================
class BackupDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def delete(self, request, filename):
        backup_dir = get_backup_dir()
        filepath   = backup_dir / filename
        try:
            filepath.resolve().relative_to(backup_dir.resolve())
        except ValueError:
            return Response({'error': 'Accès non autorisé.'}, status=403)

        if not filepath.exists():
            return Response({'error': 'Fichier introuvable.'}, status=404)

        filepath.unlink()
        return Response({'success': True, 'message': f'Sauvegarde supprimée.'})


# ============================================================
# GET /api/backup/stats/  — Stats globales
# ============================================================
class BackupStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        backup_dir  = get_backup_dir()
        files       = [f for f in backup_dir.iterdir() if f.is_file()]
        total_size  = sum(f.stat().st_size for f in files)
        last_backup = None

        if files:
            latest      = max(files, key=lambda f: f.stat().st_mtime)
            last_backup = timezone.datetime.fromtimestamp(
                latest.stat().st_mtime
            ).isoformat()

        return Response({
            'total':       len(files),
            'total_size':  f"{total_size / (1024**3):.2f} GB",
            'last_backup': last_backup,
        })