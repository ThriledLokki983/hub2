from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


def send_mail(_to, context, sender=None):
    from_email = f'{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM}>' if not sender else sender
    html_content = render_to_string(f'{settings.BASE_DIR}/core/templates/emails/base.html', context=context.get('data'))
    text_content = render_to_string(f'{settings.BASE_DIR}/core/templates/emails/base.txt', context=context.get('data'))
    msg = EmailMultiAlternatives(
        context.get('subject'),
        text_content,
        from_email,
        [_to]
    )
    msg.attach_alternative(html_content, 'text/html')
    return msg.send()
