import secrets

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import ResetCode

User = get_user_model()


def get_valid_code(email, code):
    user = User.objects.filter(email__iexact=email, is_active=True).first()
    if not user:
        return None
    rc = ResetCode.objects.filter(user=user, used=False).order_by('-created_at').first()
    if not rc or rc.is_expired() or rc.attempts >= 5:
        return None
    if rc.code != code:
        rc.attempts += 1
        rc.save()
        return None
    return rc


@api_view(['POST'])
def request_code(request):
    email = str(request.data.get('email', '')).strip()
    user = User.objects.filter(email__iexact=email, is_active=True).first()

    if user:
        code = f"{secrets.randbelow(1000000):06d}"
        ResetCode.objects.filter(user=user, used=False).update(used=True)
        ResetCode.objects.create(user=user, code=code)
        send_mail(
            subject="Miam Plan : votre code de vérification",
            message=f"Votre code est : {code}\nIl expire dans 10 minutes.",
            from_email=None,
            recipient_list=[user.email],
        )

    return Response({'message': 'Si un compte existe, un code a été envoyé.'})


@api_view(['POST'])
def verify_code(request):
    rc = get_valid_code(request.data.get('email', ''), str(request.data.get('code', '')))
    if not rc:
        return Response({'error': 'Code invalide ou expiré.'}, status=400)
    return Response({'message': 'Code valide.'})


@api_view(['POST'])
def reset_password(request):
    email = request.data.get('email', '')
    code = str(request.data.get('code', ''))
    password = request.data.get('password', '')

    rc = get_valid_code(email, code)
    if not rc:
        return Response({'error': 'Code invalide ou expiré.'}, status=400)

    try:
        validate_password(password, rc.user)
    except ValidationError as e:
        return Response({'error': ' '.join(e.messages)}, status=400)

    rc.user.set_password(password)
    rc.user.save()
    rc.used = True
    rc.save()
    return Response({'message': 'Mot de passe modifié.'})