# appointments/pdf_views.py

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from django.utils import timezone
import logging
from io import BytesIO

# Import reportlab
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

logger = logging.getLogger(__name__)

from .models import Appointment

class AppointmentReceiptPDFView(APIView):
    """
    Vue pour générer un justificatif PDF pour un rendez-vous présentiel
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            # Récupérer le rendez-vous
            appointment = Appointment.objects.get(
                id=pk,
                patient=request.user
            )
        except Appointment.DoesNotExist:
            return Response(
                {'error': 'Rendez-vous non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Vérifier le statut
        if appointment.status not in ['confirmed', 'completed']:
            return Response(
                {'error': 'Ce justificatif n\'est disponible que pour les rendez-vous confirmés ou terminés'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Vérifier que c'est un rendez-vous présentiel
        if appointment.type not in ['presentiel', 'in-person']:
            return Response(
                {'error': 'Ce justificatif est uniquement disponible pour les rendez-vous présentiels'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Générer le PDF
            pdf_content = self.generate_pdf(appointment)
            
            if pdf_content:
                response = HttpResponse(pdf_content, content_type='application/pdf')
                response['Content-Disposition'] = f'attachment; filename="justificatif_rendezvous_{appointment.id}.pdf"'
                return response
            else:
                return Response(
                    {'error': 'Erreur lors de la génération du PDF'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        except Exception as e:
            logger.error(f"Erreur lors de la génération du PDF: {str(e)}")
            return Response(
                {'error': f'Erreur technique: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def generate_pdf(self, appointment):
        """
        Génère le PDF avec ReportLab
        """
        try:
            buffer = BytesIO()
            doc = SimpleDocTemplate(
                buffer,
                pagesize=A4,
                rightMargin=2*cm,
                leftMargin=2*cm,
                topMargin=2*cm,
                bottomMargin=2*cm
            )

            # Styles
            styles = getSampleStyleSheet()
            
            # Style pour le titre principal
            title_style = ParagraphStyle(
                'TitleStyle',
                parent=styles['Heading1'],
                fontSize=20,
                textColor=colors.HexColor('#0f766e'),
                alignment=TA_CENTER,
                spaceAfter=20
            )
            
            # Style pour les sous-titres
            subtitle_style = ParagraphStyle(
                'SubtitleStyle',
                parent=styles['Heading2'],
                fontSize=14,
                textColor=colors.HexColor('#0f766e'),
                spaceAfter=10,
                spaceBefore=15
            )
            
            # Style pour les labels
            label_style = ParagraphStyle(
                'LabelStyle',
                parent=styles['Normal'],
                fontSize=11,
                textColor=colors.HexColor('#4a5568'),
                fontName='Helvetica-Bold'
            )
            
            # Style pour les valeurs
            value_style = ParagraphStyle(
                'ValueStyle',
                parent=styles['Normal'],
                fontSize=11,
                textColor=colors.HexColor('#2d3748')
            )
            
            # Style pour le message de confirmation
            confirm_style = ParagraphStyle(
                'ConfirmStyle',
                parent=styles['Normal'],
                fontSize=12,
                textColor=colors.HexColor('#0f766e'),
                alignment=TA_CENTER,
                backColor=colors.HexColor('#f0fff4'),
                borderPadding=10,
                spaceAfter=15
            )

            # Style pour le pied de page
            footer_style = ParagraphStyle(
                'FooterStyle',
                parent=styles['Normal'],
                fontSize=9,
                textColor=colors.HexColor('#718096'),
                alignment=TA_CENTER
            )

            # Récupérer les informations du médecin
            doctor_info = {}
            if appointment.doctor:
                doctor = appointment.doctor
                doctor_info = {
                    'full_name': f"Dr. {doctor.user.first_name} {doctor.user.last_name}",
                    'specialization': doctor.specialization or appointment.doctor_specialty,
                    'hospital': doctor.hospital.name if doctor.hospital else 'Cabinet Médical',
                    'hospital_address': doctor.hospital.address if doctor.hospital else '',
                    'hospital_phone': doctor.hospital.phone if doctor.hospital else '',
                }
            else:
                doctor_info = {
                    'full_name': appointment.doctor_name or 'Médecin',
                    'specialization': appointment.doctor_specialty or '',
                    'hospital': 'Cabinet Médical',
                    'hospital_address': '',
                    'hospital_phone': '',
                }

            # Construire le contenu
            story = []
            
            # ============================================
            # EN-TÊTE
            # ============================================
            # Nom de l'établissement
            story.append(Paragraph(
                f"<b>{doctor_info['hospital']}</b>",
                ParagraphStyle(
                    'HospitalStyle',
                    parent=styles['Normal'],
                    fontSize=16,
                    textColor=colors.HexColor('#1a202c'),
                    alignment=TA_CENTER,
                    spaceAfter=5
                )
            ))
            
            # Coordonnées
            hospital_details = []
            if doctor_info['hospital_address']:
                hospital_details.append(doctor_info['hospital_address'])
            if doctor_info['hospital_phone']:
                hospital_details.append(f"Tél: {doctor_info['hospital_phone']}")
            
            if hospital_details:
                story.append(Paragraph(
                    "<br/>".join(hospital_details),
                    ParagraphStyle(
                        'HospitalDetailsStyle',
                        parent=styles['Normal'],
                        fontSize=10,
                        textColor=colors.HexColor('#666666'),
                        alignment=TA_CENTER,
                        spaceAfter=10
                    )
                ))
            
            # Ligne de séparation
            story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#0f766e'), spaceAfter=15))
            
            # Titre principal
            story.append(Paragraph("JUSTIFICATIF DE RENDEZ-VOUS", title_style))
            story.append(Paragraph("Document officiel - À conserver", 
                ParagraphStyle(
                    'Subtitle',
                    parent=styles['Normal'],
                    fontSize=12,
                    textColor=colors.HexColor('#666666'),
                    alignment=TA_CENTER,
                    spaceAfter=20
                )
            ))
            
            # ============================================
            # MESSAGE DE CONFIRMATION
            # ============================================
            story.append(Paragraph(
                "<b>✓ Rendez-vous confirmé</b><br/>Ce document atteste que le rendez-vous suivant a été confirmé par le médecin.",
                confirm_style
            ))
            
            story.append(Spacer(1, 0.5*cm))
            
            # ============================================
            # INFORMATIONS DU PATIENT
            # ============================================
            story.append(Paragraph("Informations du patient", subtitle_style))
            
            patient_data = [
                ["Nom complet", f"{appointment.patient.first_name} {appointment.patient.last_name}"],
                ["Email", appointment.patient.email],
                ["Téléphone", appointment.patient.phone or "Non renseigné"],
                ["Date de naissance", appointment.patient.date_of_birth.strftime('%d/%m/%Y') if appointment.patient.date_of_birth else "Non renseigné"],
                ["Genre", appointment.patient.gender or "Non renseigné"],
            ]
            
            patient_table = Table(patient_data, colWidths=[4*cm, 8*cm])
            patient_table.setStyle(TableStyle([
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#4a5568')),
                ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#2d3748')),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('LINEABOVE', (0, 1), (-1, 1), 0.5, colors.HexColor('#e2e8f0')),
                ('LINEABOVE', (0, 2), (-1, 2), 0.5, colors.HexColor('#e2e8f0')),
                ('LINEABOVE', (0, 3), (-1, 3), 0.5, colors.HexColor('#e2e8f0')),
                ('LINEABOVE', (0, 4), (-1, 4), 0.5, colors.HexColor('#e2e8f0')),
            ]))
            story.append(patient_table)
            story.append(Spacer(1, 0.5*cm))
            
            # ============================================
            # INFORMATIONS DU RENDEZ-VOUS
            # ============================================
            story.append(Paragraph("Informations du rendez-vous", subtitle_style))
            
            # Date formatée
            date_formatted = appointment.date.strftime('%A %d %B %Y')
            date_formatted = date_formatted.replace('é', 'e').replace('è', 'e').replace('ê', 'e')
            
            appointment_data = [
                ["Médecin", doctor_info['full_name']],
                ["Spécialité", doctor_info['specialization']],
                ["Date", date_formatted],
                ["Heure", appointment.time.strftime('%H:%M')],
                ["Type", "Présentiel"],
                ["Statut", "✓ Confirmé"],
            ]
            
            if appointment.reason and appointment.reason != 'Non précisé':
                appointment_data.append(["Motif", appointment.reason])
            
            appointment_table = Table(appointment_data, colWidths=[4*cm, 8*cm])
            appointment_table.setStyle(TableStyle([
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#4a5568')),
                ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#2d3748')),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('LINEABOVE', (0, 1), (-1, 1), 0.5, colors.HexColor('#e2e8f0')),
                ('LINEABOVE', (0, 2), (-1, 2), 0.5, colors.HexColor('#e2e8f0')),
                ('LINEABOVE', (0, 3), (-1, 3), 0.5, colors.HexColor('#e2e8f0')),
                ('LINEABOVE', (0, 4), (-1, 4), 0.5, colors.HexColor('#e2e8f0')),
                ('LINEABOVE', (0, 5), (-1, 5), 0.5, colors.HexColor('#e2e8f0')),
            ]))
            
            # Coloration spéciale pour le statut
            appointment_table.setStyle(TableStyle([
                ('TEXTCOLOR', (1, 5), (1, 5), colors.HexColor('#0f766e')),
            ]))
            
            story.append(appointment_table)
            story.append(Spacer(1, 0.5*cm))
            
            # ============================================
            # INFORMATIONS DE VÉRIFICATION
            # ============================================
            story.append(Paragraph(
                f"<b>Document authentique</b><br/>"
                f"Ce justificatif a été généré le {timezone.now().strftime('%d/%m/%Y à %H:%M')}.<br/>"
                f"Référence: <b>#{appointment.id}</b>",
                ParagraphStyle(
                    'VerifStyle',
                    parent=styles['Normal'],
                    fontSize=10,
                    textColor=colors.HexColor('#4a5568'),
                    alignment=TA_CENTER,
                    backColor=colors.HexColor('#f7fafc'),
                    borderPadding=12,
                    spaceAfter=10
                )
            ))
            
            # ============================================
            # PIED DE PAGE
            # ============================================
            story.append(Spacer(1, 1*cm))
            story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e2e8f0'), spaceAfter=10))
            
            story.append(Paragraph(
                "Ce document est un justificatif officiel de rendez-vous médical.",
                footer_style
            ))
            story.append(Paragraph(
                "En cas de besoin, vous pouvez contacter le secrétariat de l'établissement.",
                footer_style
            ))
            story.append(Paragraph(
                f"Document généré automatiquement - {timezone.now().strftime('%d/%m/%Y à %H:%M')}",
                ParagraphStyle(
                    'FooterDateStyle',
                    parent=styles['Normal'],
                    fontSize=8,
                    textColor=colors.HexColor('#a0aec0'),
                    alignment=TA_CENTER,
                    spaceAfter=5
                )
            ))

            # ============================================
            # GÉNÉRATION DU PDF
            # ============================================
            doc.build(story)
            
            # Récupérer le contenu
            pdf_content = buffer.getvalue()
            buffer.close()
            
            return pdf_content
            
        except Exception as e:
            logger.error(f"Erreur dans generate_pdf: {str(e)}")
            logger.error(f"Traceback: {e.__traceback__}")
            return None