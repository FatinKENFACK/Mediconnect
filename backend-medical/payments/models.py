from django.db import models
from django.conf import settings
from accounts.models import Hospital

class Payment(models.Model):

    STATUS_CHOICES = [
        ('completed', 'Complété'),
        ('pending',   'En attente'),
        ('failed',    'Échoué'),
        ('refunded',  'Remboursé'),
        ('cancelled', 'Annulé'),
    ]
    METHOD_CHOICES = [
        ('credit_card',   'Carte bancaire'),
        ('mobile_money',  'Mobile Money'),
        ('bank_transfer', 'Virement bancaire'),
    ]
    TYPE_CHOICES = [
        ('subscription', 'Abonnement'),
        ('consultation', 'Consultation'),
        ('other',        'Autre'),
    ]

    hospital       = models.ForeignKey(
        Hospital,
        on_delete=models.CASCADE,
        related_name='payments'
    )
    # Lien optionnel vers l'abonnement
    subscription   = models.ForeignKey(
        'accounts.Subscription',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='payments'
    )
    amount         = models.PositiveIntegerField()
    processing_fee = models.PositiveIntegerField(default=0)
    net_amount     = models.IntegerField(default=0)
    currency       = models.CharField(max_length=10, default='XAF')
    status         = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    method         = models.CharField(max_length=20, choices=METHOD_CHOICES, default='bank_transfer')
    payment_type   = models.CharField(max_length=20, choices=TYPE_CHOICES, default='subscription')
    description    = models.CharField(max_length=255, blank=True)
    transaction_id = models.CharField(max_length=255, blank=True)
    invoice_id     = models.CharField(max_length=100, blank=True)
    failure_reason = models.CharField(max_length=255, blank=True)
    refunded       = models.BooleanField(default=False)
    refund_date    = models.DateField(null=True, blank=True)
    refund_reason  = models.CharField(max_length=255, blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"PAY-{self.id} — {self.hospital.name} — {self.amount} {self.currency}"

    def save(self, *args, **kwargs):
        self.net_amount = self.amount - self.processing_fee
        super().save(*args, **kwargs)
        if not self.invoice_id:
            from django.utils import timezone
            year = timezone.now().year
            self.invoice_id = f"INV-{year}-{str(self.id).zfill(4)}"
            Payment.objects.filter(pk=self.pk).update(invoice_id=self.invoice_id)