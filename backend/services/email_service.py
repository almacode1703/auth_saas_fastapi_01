from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from config import MAIL_USERNAME, MAIL_PASSWORD, MAIL_FROM
import os

conf = ConnectionConfig(
    MAIL_USERNAME=MAIL_USERNAME,
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_FROM=MAIL_FROM,
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=False,
)

def load_template(filename: str, **kwargs) -> str:
    template_path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "templates",
        filename
    )
    with open(template_path, "r") as f:
        content = f.read()
    
    # safely replace only our placeholders
    for key, value in kwargs.items():
        content = content.replace(f"{{{{{key}}}}}", str(value))  # replaces {{otp}} with actual value
    
    return content


async def send_otp_email(email: str, otp: str):
    body = load_template("otp_email.html", otp=otp)  # ← load from file
    message = MessageSchema(
        subject="Your verification code",
        recipients=[email],
        body=body,
        subtype=MessageType.html
    )
    fm = FastMail(conf)
    await fm.send_message(message)


