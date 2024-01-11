import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  private async transporter() {
    try {
      // Créer un compte de test Nodemailer pour les tests
      const testAccount = await nodemailer.createTestAccount();
  
      // Créer un objet de transport Nodemailer avec les paramètres spécifiés
      const transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        ignoreTLS: true,
        auth: {
          user: this.configService.get('MAILER_USER')!,
          pass: this.configService.get('MAILER_PASSWORD')!,
        },
      });
  
      // Retourner l'objet transporter créé
      return transporter;
    } catch (error) {
      // Gérer les erreurs potentielles liées à la création du compte de test ou du transporter
      console.error('Erreur lors de la création du transporter :', error);
      throw error; // Propager l'erreur pour une gestion ultérieure
    }
  }

  async sendSignupConfirmation(email: string, url: string) {
    (await this.transporter()).sendMail({
      from: 'app@localhost.com',
      to: email,
      subject: "Validation d'inscription",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              text-align: center;
              margin: 20px;
            }
        
            h1 {
              color: #3498db;
            }
        
            p {
              color: #555;
            }
        
            .verification-link {
              display: inline-block;
              padding: 10px 20px;
              margin: 15px 0;
              font-size: 16px;
              color: #fff;
              text-decoration: none;
              background-color: #3498db;
              border-radius: 5px;
            }
          </style>
        </head>
        
        <body>
          <h1>Validation d\'inscription</h1>
          <p>Cher ${email},</p>
          <p>Merci pour votre inscription. S'il vous plait cliquez sur le lien suivant pour valider votre addresse email:</p>
          <a href="${url}" class="verification-link">Verifiez l'email</a>
          <p>Le lien expire dans 7 jours</p>
        </body>
        
        </html>      
      `,
    });
  }

  async sendResetPassword(userEmail: string, url: string, code: string) {
    (await this.transporter()).sendMail({
      from: 'app@localhost.com',
      to: userEmail,
      subject: 'Reset password',
      html: `
        <a href="${url}">Reset Password</a>
        <p>Secret code <strong>${code}</strong></p>
        <p>Code will expire in 15 minutes</p>
      `,
    });
  }
}
