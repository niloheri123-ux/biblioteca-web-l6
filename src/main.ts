import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Amplify } from 'aws-amplify';

// Tramo 8.3 · Amplify.configure va ANTES de bootstrapApplication: si el
// primer componente pregunta por la sesion antes de esto, el error es
// "AuthUserPoolException: Auth UserPool not configured".
//
// Los cuatro valores salen de tu propio user pool de Cognito (L3, tramos 1 al
// 4) y estan en tu ficha.txt. Ninguno es secreto: un cliente publico no
// tiene secretos.
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId:       'us-east-1_AK5DV3KCC',
      userPoolClientId: '3eobopgbba6rea1slibea0q7sn',
      loginWith: {
        oauth: {
          domain:          'us-east-1ak5dv3kcc.auth.us-east-1.amazoncognito.com',
          scopes:          ['openid', 'profile', 'biblioteca/libros.leer'],
          redirectSignIn:  ['http://localhost:4200/callback'],
          redirectSignOut: ['http://localhost:4200'],
          responseType:    'code',
        },
      },
    },
  },
});

// Hace que Amplify escuche la vuelta del login y canjee el codigo solo. Sin
// esto, vuelves de Cognito con un `?code=` en la barra de direcciones y no
// pasa absolutamente nada.
import 'aws-amplify/auth/enable-oauth-listener';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
