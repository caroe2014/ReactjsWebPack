// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import cssesc from 'cssesc';
import { adobeFont } from 'web/client/app/utils/css/cssFontFaces';

export const cssConstructor = async (cssData, theme, language, i18n) => {
  let trans;

  trans = `
    .paymentText { font-size: 0; display: none; } 
    .paymentText::after { 
      font-size: 18px; 
      content: '${cssesc(i18n.t('IFRAME_PAYMENT_TEXT_HEADER'))}'; 
      color: ${(theme && theme.textAndControls) ? theme.textAndControls.titleColor : `#505050;`};  
    }
 
     #cardNumberlabel { font-size: 0 } 
     #cardNumberlabel::after { 
       font-size: 16px; 
       content: '${cssesc(i18n.t('IFRAME_CARD_NUMBER_LABEL'))}';
       color: ${(theme && theme.textAndControls) ? theme.textAndControls.titleColor : `#505050;`};  
      }
     #cardNumber-error { font-size: 0 } 
     #cardNumber-error::after { font-size: 16px; content: '${cssesc(i18n.t('IFRAME_CARD_NUMBER_VALIDATION'))}'; }
 
     #expiryDatelabel { font-size: 0 } 
     #expiryDatelabel::after {
       font-size: 16px; 
       content: '${cssesc(i18n.t('IFRAME_EXP_DATE_LABEL'))}';
       color: ${(theme && theme.textAndControls) ? theme.textAndControls.titleColor : `#505050;`};  
      }
     #expiryDate-error { font-size: 0 } 
     #expiryDate-error::after { font-size: 16px; content: '${cssesc(i18n.t('IFRAME_EXP_DATE_VALIDATION'))}'; }
     #expirationYear-error { font-size: 0 } 
     #expirationYear-error::after { font-size: 16px; content: '${cssesc(i18n.t('IFRAME_EXP_DATE_VALIDATION'))}'; }
     #DateofExpiry-error { font-size: 0 } 
     #DateofExpiry-error::after { font-size: 16px; content: '${cssesc(i18n.t('IFRAME_EXP_DATE_VALIDATION'))}'; }
 
     #cvvlabel { font-size: 0 } 
     #cvvlabel::after { 
       font-size: 16px; 
       content: '${cssesc(i18n.t('IFRAME_CVV_LABEL'))}';
       color: ${(theme && theme.textAndControls) ? theme.textAndControls.titleColor : `#505050;`};  
      }
     #cvv-error { font-size: 0 } 
     #cvv-error::after { font-size: 16px; content: '${cssesc(i18n.t('IFRAME_CVV_VALIDATION'))}'; }
 
     #postalCodelabel { font-size: 0 } 
     #postalCodelabel::after { 
       font-size: 16px; 
       content: '${cssesc(i18n.t('IFRAME_ZIP_LABEL'))}';
       color: ${(theme && theme.textAndControls) ? theme.textAndControls.titleColor : `#505050;`};  
      }
     #postalCode-error { font-size: 0 } 
     #postalCode-error::after { font-size: 16px; content: '${cssesc(i18n.t('IFRAME_ZIP_VALIDATION'))}'; }
 

     #savecardText { font-size: 0 } 
     #savecardText::after { 
      font-size: 16px; 
      content: '${cssesc(i18n.t('IFRAME_SAVE_CARD_LABEL'))}';
      color: ${(theme && theme.textAndControls) ? theme.textAndControls.titleColor : `#505050;`};  
     }

     #promptText-error { font-size: 0 } 
     #promptText-error::after { font-size: 16px; content: '${cssesc(i18n.t('IFRAME_PROMPT_VALIDATION'))}'; }

     #checkmark {
      border: 1px solid ${(theme && theme.textAndControls) ? theme.textAndControls.buttonControlColor : `#347CFF;`};
     }

     .container input:checked ~ .checkmark {
      background-color: ${(theme && theme.textAndControls) ? theme.textAndControls.buttonControlColor : `#347CFF;`};
     }

     #cardholderNamelabel { font-size: 0 } 
     #cardholderNamelabel::after { 
       font-size: 16px; 
       content: '${cssesc(i18n.t('IFRAME_CARD_HOLDER_LABEL'))}';
       color: ${(theme && theme.textAndControls) ? theme.textAndControls.titleColor : `#505050;`};  
      }
     #cardholderName-error { font-size: 0 } 
     #cardholderName-error::after { font-size: 16px; content: '${cssesc(i18n.t('IFRAME_CARD_HOLDER_VALIDATION'))}'; }
 
     #cancelSubmit { font-size: 0 } 
     #cancelSubmit::after { font-size: 16px; content: '${cssesc(i18n.t('IFRAME_CLEAR_BUTTON'))}'; }
 
     .submitBtn {
      background-color: ${(theme && theme.textAndControls) ? theme.textAndControls.buttonControlColor : `#347CFF;`};
      color: ${(theme && theme.textAndControls) ? theme.textAndControls.buttonTextColor : `#FFFFFF;`};
      }
     .cancelBtn{
      color: ${(theme && theme.textAndControls) ? theme.textAndControls.buttonControlColor : `#347CFF;`};
     }
     .fa-eye {
        color: ${(theme && theme.textAndControls) ? theme.textAndControls.buttonControlColor : `#347CFF;`};
      }
      
      .fa-eye-slash {
        color: ${(theme && theme.textAndControls) ? theme.textAndControls.buttonControlColor : `#347CFF;`};
      }
    ${theme && theme.textAndControls && theme.textAndControls.fontFamily === 'adobeClean' && adobeFont}
     body {
       font-family: ${theme && theme.textAndControls && theme.textAndControls.fontFamily === 'adobeClean' ? 'Adobe Clean'
    : `'Roboto', sans-serif`};
       color: #505050;
     }
    `;

  return cssData + trans;
};
