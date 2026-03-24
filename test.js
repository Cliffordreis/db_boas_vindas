let iframeDiv;
let spotDiv;
let formLinkMatch;
function initializeDynamicForms() {
    // Find all target div elements
    iframeDiv = document.querySelector("#iframeForm");
    spotDiv = document.querySelector("#hubspotForm");
    const divContent = iframeDiv.innerHTML;
    
    // Extract all variables independently using separate regex patterns
    formLinkMatch = divContent.match(/##FORMLINK=(.*?)##/);
    
    let matchFundo = divContent.match(/##BGCOLOR=(.*?)##/);
    let matchBotao = divContent.match(/##CORBOTAO=(.*?)##/);
    
    if (formLinkMatch) {
        formLinkMatch = formLinkMatch[1];
        let corFundo = matchFundo ? matchFundo[1] : "FFFFFF";
        let corBotao = matchBotao ? matchBotao[1] : null;
        
        iframeDiv.innerHTML = ''; // Clear original content
        createDynamicForm(iframeDiv, formLinkMatch, corFundo, corBotao);
    }
}

function createDynamicForm(iframeDiv, formLink, corFundo, corBotao) {
    let wFrame = iframeDiv.parentElement.clientWidth || 1000;
    let hFrame = 'auto';
    let wSpot = spotDiv.parentElement.clientWidth || 1000;
    let hSpot = 'auto';

    const formHTML = `
        <style>
        #hubspotForm, #hubspotForm iframe {width:${wSpot}px; height:${hSpot} !important;}
        </style>
        <iframe class="zframe" src="${formLink}?nome=&email=&telefone=&bg=${corFundo}" style="width:${wFrame}px;height:${hFrame};border: 0; width: 100%;" sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation" allowfullscreen="true">
        </iframe>`;

    iframeDiv.innerHTML = formHTML;

    hbspt.forms.create({
        portalId: "46434759",
        formId: "4a3d76af-e665-4967-a72c-31dc455b784f",
        region: "na1",
        target: "#hubspotForm",
        onFormReady: function($form) {
            var styleTag = document.createElement('style');
            styleTag.textContent = `
                #hubspotForm, #hubspotForm iframe {width:${wSpot}px; height:${hSpot} !important;}
                .hbspt-form {
                    margin: 0px !important;
                }
                .hbspt-form * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                .hbspt-form {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    max-width: 600px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    padding: 40px;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .hbspt-form .hs-form-field {
                    margin-bottom: 15px !important;
                }
                .hbspt-form label {
                    font-family:arial !important;
                    display: block;
                    margin-bottom: 2px !important;
                    font-weight: 600 !important;
                    color: #777 !important;
                    font-size: 11px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.5px !important;
                }
                .hbspt-form label.hs-error-msg {color:red !important;font-size:11px !important;font-weight:500 !important}
                .hbspt-form input[type="text"],
                .hbspt-form input[type="email"],
                .hbspt-form input[type="tel"] {
                    width: 100%;
                    padding: 10px 12px !important;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 10px;
                    background: #f8fafc;
                    font-size: 15px;
                    color: #2d3748;
                    transition: all 0.3s ease;
                }
                .hbspt-form input::placeholder {
                    color: #a0aec0;
                }
                .hbspt-form input:focus {
                    outline: none;
                    border-color: #4a5568;
                    background: #ffffff;
                    box-shadow: 0 0 0 3px rgba(74, 85, 104, 0.1);
                    transform: translateY(-1px);
                }
                .hbspt-form input:valid {
                    border-color: #cbd5e0;
                }
                .hbspt-form .hs-button.primary.large {
                    width: 100%;
                    padding: 16px;
                    background: linear-gradient(135deg, #4a5568, #2d3748);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    cursor: pointer;
                    margin-top:13px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(74, 85, 104, 0.2);
                }
                .hbspt-form .hs-button.primary.large:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(74, 85, 104, 0.3);
                    background: linear-gradient(135deg, #2d3748, #1a202c);
                }
                .hbspt-form .hs-button.primary.large:active {
                    transform: translateY(0);
                }
                @media (max-width: 768px) {
                    .hbspt-form {
                        padding: 30px 24px;
                        margin: 16px;
                        width: auto;
                    }
                    .hbspt-form .hs-button.primary.large {
                        padding: 14px;
                    }
                }
                .hs-phone,
                .hs-phone input[name="phone"] {
                    display: none !important;
                }
            `;
            $form.appendChild(styleTag);
            const nomeInput = $form.querySelector('[name="nome_ser"]');
            const emailInput = $form.querySelector('[name="email"]');
            const hsMail = $form.querySelector('.hs-email');
            const mailInput = $form.querySelector('input[name="email"]');
            const hsPhone = $form.querySelector('.hs-phone');
            const phoneInput = $form.querySelector('input[name="phone"]');

            const forbiddenChars = /[&=(){}[\]'"]/; 

            if (nomeInput) {
                nomeInput.setAttribute('required', 'required');
                nomeInput.addEventListener('input', function(e) {
                    this.value = this.value.replace(/[&=(){}[\]'"]/g, '');
                    this.setCustomValidity('');
                    this.reportValidity();
                });
                nomeInput.addEventListener('blur', function() {
                    validarNome(this);
                });
            }

            if (emailInput) {
                emailInput.setAttribute('required', 'required');
                emailInput.addEventListener('input', function(e) {
                    this.value = this.value.replace(/[&=(){}[\]'"]/g, '');
                    this.setCustomValidity('');
                    this.reportValidity();
                });
                emailInput.addEventListener('blur', function() {
                    validarEmail(this);
                });
            }

            function validarNome(campo) {
                const valor = campo.value.trim();
                if (valor.length === 0) {
                    campo.setCustomValidity('O nome é obrigatório.');
                } else if (valor.length < 4) {
                    campo.setCustomValidity('O nome deve ter no mínimo 4 caracteres.');
                } else if (forbiddenChars.test(valor)) {
                    campo.setCustomValidity('O nome não pode conter & = ( ) { } [ ] \' "');
                } else {
                    campo.setCustomValidity('');
                }
                campo.reportValidity();
            }

            function validarEmail(campo) {
                const valor = campo.value.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (valor.length === 0) {
                    campo.setCustomValidity('O e-mail é obrigatório.');
                } else if (!emailRegex.test(valor)) {
                    campo.setCustomValidity('Digite um e-mail válido (ex: nome@dominio.com).');
                } else if (forbiddenChars.test(valor)) {
                    campo.setCustomValidity('O e-mail não pode conter & = ( ) { } [ ] \' "');
                } else {
                    campo.setCustomValidity('');
                }
                campo.reportValidity();
            }

            if (!hsPhone || !phoneInput) return;

            if ($form.querySelector('.hs-telefone')) return;
            
            const telefoneWrapper = document.createElement('div');
            telefoneWrapper.className = 'hs-telefone';

            telefoneWrapper.innerHTML = `
                <label for="telefone">Telefone *</label>
                <input type="tel"
                        id="telefone"
                        minlength="14"
                        maxlength="15"
                        required
                        pattern="^\\(\\d{2}\\) \\d{4,5}-?\\d{4}$"
                        placeholder="(XX) XXXXX-XXXX"
                        title="Digite um telefone válido com DDD (8 ou 9 dígitos)">
            `;

            hsPhone.parentNode.insertBefore(telefoneWrapper, hsPhone);
        
            const submitButton = $form.querySelector('.hs-button.primary.large');
            if (corFundo) {
                submitButton.style.backgroundColor = '#'+corFundo;
                submitButton.style.backgroundImage = 'none';
            }
            if (corBotao) {
                submitButton.style.color = corBotao;
            }

            const telefoneInput = $form.querySelector('#telefone');
            telefoneInput.setCustomValidity('');
            let previousValue = '';
            
            telefoneInput.addEventListener('input', function(e) {
                const cursorPosition = e.target.selectionStart;
                let value = e.target.value.replace(/\D/g, '');
                
                const currentValue = e.target.value;
                
                let formattedValue = '';
                if (value.length === 11) {
                    formattedValue = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
                } else if (value.length === 10) {
                    formattedValue = value.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
                } else if (value.length > 0) {
                    formattedValue = value.replace(/^(\d{0,2})/, '($1)');
                    if (value.length > 2) {
                        if (value.length <= 6) {
                            formattedValue = formattedValue.replace(/(\d{4})$/, ' $1');
                        } else if (value.length <= 10) {
                            formattedValue = formattedValue.replace(/(\d{4})(\d{0,4})$/, ' $1-$2');
                        } else {
                            formattedValue = formattedValue.replace(/(\d{5})(\d{0,4})$/, ' $1-$2');
                        }
                    }
                }
                
                e.target.value = formattedValue;
                
                if (currentValue.length > formattedValue.length && cursorPosition > 0) {
                    e.target.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
                } else {
                    e.target.setSelectionRange(formattedValue.length, formattedValue.length);
                }
                
                previousValue = formattedValue;
            });
            
            telefoneInput.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace') {
                    const cursorPosition = e.target.selectionStart;
                    const value = e.target.value;
                    
                    if (cursorPosition > 0 && 
                        (value[cursorPosition - 1] === ' ' || 
                        value[cursorPosition - 1] === '(' || 
                        value[cursorPosition - 1] === ')' || 
                        value[cursorPosition - 1] === '-')) {
                        e.preventDefault();
                        e.target.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
                    }
                }
            });
            telefoneInput.addEventListener('keydown', function () {
                    this.setCustomValidity('');
            })
            telefoneInput.addEventListener('blur', function () {
                const digits = this.value.replace(/\D/g, '');
                if (digits.length !== 10 && digits.length !== 11) {
                    this.setCustomValidity('Digite um telefone válido.');
                } else {
                    this.setCustomValidity('');
                }
            });
            submitButton.addEventListener('click', function(e) {
                phoneInput.value = telefoneInput.value.replace(/\D/g, '');

                if (nomeInput) validarNome(nomeInput);
                if (emailInput) validarEmail(emailInput);

                if (!$form.checkValidity()) {
                    e.preventDefault();
                    $form.reportValidity();
                    return;
                }
            });

        },
        onFormSubmit: function($form) {
            if (!$form.checkValidity()) {
                $form.reportValidity();
                return false;
            }
            var nome = $form.querySelector('[name="nome_ser"]')?.value;
            var email = $form.querySelector('[name="email"]')?.value;
            var phone = $form.querySelector('[name="phone"]')?.value;

            var params = new URLSearchParams();
            if (nome) params.append('nome', encodeURIComponent(nome));
            if (email) params.append('email', encodeURIComponent(email));
            if (phone) params.append('telefone', encodeURIComponent(phone));
            var redirectUrl = formLinkMatch + '?nome=' + nome + '&email=' + email + '&telefone=' + phone + '&bg=1565c0';
            
            window.top.location.href = redirectUrl;
            return false;
        }
    });

}

if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDynamicForms);
} else {
        initializeDynamicForms();
}
