# payments/campay_service.py
"""
Wrapper autour du SDK officiel CamPay pour initier et vérifier
des paiements Mobile Money (MTN / Orange) côté patient.
"""

import os
from campay.sdk import Client as CamPayClient


def get_campay_client():
    return CamPayClient({
        "app_username": os.environ.get("CAMPAY_APP_USERNAME"),
        "app_password": os.environ.get("CAMPAY_APP_PASSWORD"),
        "environment": os.environ.get("CAMPAY_ENVIRONMENT", "DEV"),
    })


def initiate_collection(amount, phone_number, description, external_reference=""):
    """
    Demande à CamPay de collecter un paiement Mobile Money.
    Déclenche une notification (popup PIN) sur le téléphone du patient.

    Renvoie un dict contenant au minimum 'reference' et 'status'.
    """
    client = get_campay_client()
    response = client.collect({
        "amount": str(int(amount)),   # CamPay n'accepte pas les décimales
        "currency": "XAF",
        "from": phone_number,          # format attendu : 237XXXXXXXXX
        "description": description,
        "external_reference": external_reference,
    })
    return response


def check_transaction_status(reference):
    """
    Vérifie le statut d'une transaction CamPay déjà initiée.
    Statuts possibles : PENDING, SUCCESSFUL, FAILED
    """
    client = get_campay_client()
    response = client.get_transaction_status({"reference": reference})
    return response