let iframeDiv;
let spotDiv;
let formLinkMatch;
let formAlreadyInitialized = false; 

function initializeDynamicForms() {
    if (formAlreadyInitialized) return;

    iframeDiv = document.querySelector('#iframeForm');
    spotDiv = document.querySelector('#hubspotForm');
    const divContent = iframeDiv.innerHTML;
    
    formLinkMatch = divContent.match(/##FORMLINK=(.*?)##/);
    let matchFundo = divContent.match(/##BGCOLOR=(.*?)##/);
    let matchBotao = divContent.match(/##CORBOTAO=(.*?)##/);
    
    if (formLinkMatch) {
        formLinkMatch = formLinkMatch[1];
        let corFundo = matchFundo ? matchFundo[1] : 'FFFFFF';
        let corBotao = matchBotao ? matchBotao[1] : null;
        
        iframeDiv.innerHTML = ''; 
        createDynamicForm(iframeDiv, formLinkMatch, corFundo, corBotao);
        formAlreadyInitialized = true;
    }
}

function createDynamicForm(iframeDiv, formLink, corFundo, corBotao) {
    let wFrame = iframeDiv.parentElement.clientWidth || 1000;
    let hFrame = iframeDiv.parentElement.clientHeight || 500;
    
    const formHTML = `
        <style>
        #hubspotForm, #hubspotForm iframe {
            width: 100% !important; 
            min-height: 280px !important; 
            height: auto !important;
        }
        </style>
        <iframe class="zframe" src="`+formLink+`?nome=&email=&telefone=&bg=`+corFundo+`" style="width:100%;height:`+hFrame+`px;border: 0;" sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation" allowfullscreen="true">
            `;

    iframeDiv.innerHTML = formHTML;

    hbspt.forms.create({
        portalId: "46434759",
        formId: "4a3d76af-e665-4967-a72c-31dc455b784f",
        region: "na1",
        target: "#hubspotForm",
        onFormReady: function($form) {
            var styleTag = document.createElement('style');
            styleTag.textContent = `
                #hubspotForm, #hubspotForm iframe {
                    width: 100% !important; 
                    min-height: 280px !important;
                    height: auto !important;
                }
                
                .hbspt-form, .hbspt-form * { 
                    margin: 0; 
                    padding: 0; 
                    box-sizing: border-box !important; 
                }
                
                .hbspt-form {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    width: 100%;
                    max-width: 100%;
                    background: transparent;
                    padding: 5px; 
                    overflow-x: hidden; 
                }
                .hbspt-form .hs-form-field { margin-bottom: 15px !important; }
                .hbspt-form label {
                    font-family: arial !important;
                    display: block; margin-bottom: 5px !important;
                    font-weight: 600 !important; color: #475569 !important;
                    font-size: 13px !important; text-transform: uppercase !important;
                }
                .hbspt-form label.hs-error-msg {color:red !important;font-size:11px !important;font-weight:500 !important}
                
                .hbspt-form input[type="text"],
                .hbspt-form input[type="email"],
                .hbspt-form input[type="tel"] {
                    width: 100% !important; 
                    max-width: 100% !important;
                    padding: 12px 16px !important;
                    border: 1.5px solid #e2e8f0; border-radius: 10px;
                    background: #f8fafc; font-size: 15px; color: #2d3748;
                    transition: all 0.3s ease;
                }
                .hbspt-form input:focus { outline: none; border-color: #1565C0; background: #ffffff; box-shadow: 0 0 0 3px rgba(21, 101, 192, 0.1); }
                .hbspt-form .hs-button.primary.large {
                    width: 100%; padding: 16px;
                    background: #1565C0; color: white; border: none; border-radius: 10px;
                    font-size: 18px; font-weight: 700; text-transform: uppercase;
                    cursor: pointer; margin-top: 15px; transition: all 0.3s ease;
                }
                .hbspt-form .hs-button.primary.large:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(21, 101, 192, 0.3); }
                .hs-phone, .hs-phone input[name="phone"] { display: none !important; }
            `;

            $form.appendChild(styleTag);
            const nomeInput = $form.querySelector('[name="nome_ser"]');
            const emailInput = $form.querySelector('[name="email"]');
            const hsPhone = $form.querySelector('.hs-phone');
            const phoneInput = $form.querySelector('input[name="phone"]');
            const forbiddenChars = /[&=(){}[\]'"]/;   

            if (nomeInput) {
                nomeInput.setAttribute('required', 'required');
                nomeInput.addEventListener('input', function(e) {
                    this.value = this.value.replace(/[&=(){}[\]'"]/g, '');
                    this.setCustomValidity(''); this.reportValidity();
                });
                nomeInput.addEventListener('blur', function() { validarNome(this); });
            }

            if (emailInput) {
                emailInput.setAttribute('required', 'required');
                emailInput.addEventListener('input', function(e) {
                    this.value = this.value.replace(/[&=(){}[\]'"]/g, '');
                    this.setCustomValidity(''); this.reportValidity();
                });
                emailInput.addEventListener('blur', function() { validarEmail(this); });
            }

            function validarNome(campo) {
                const valor = campo.value.trim();
                if (valor.length === 0) campo.setCustomValidity('O nome é obrigatório.');
                else if (valor.length < 4) campo.setCustomValidity('O nome deve ter no mínimo 4 caracteres.');
                else if (forbiddenChars.test(valor)) campo.setCustomValidity('O nome não pode conter & = ( ) { } [ ] \' "');
                else campo.setCustomValidity('');
                campo.reportValidity();
            }

            function validarEmail(campo) {
                const valor = campo.value.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (valor.length === 0) campo.setCustomValidity('O e-mail é obrigatório.');
                else if (!emailRegex.test(valor)) campo.setCustomValidity('Digite um e-mail válido.');
                else if (forbiddenChars.test(valor)) campo.setCustomValidity('O e-mail não pode conter & = ( ) { } [ ] \' "');
                else campo.setCustomValidity('');
                campo.reportValidity();
            }

            if (!hsPhone || !phoneInput) return;
            if ($form.querySelector('.hs-telefone')) return;
            
            const telefoneWrapper = document.createElement('div');
            telefoneWrapper.className = 'hs-telefone';
            telefoneWrapper.innerHTML = `
                <label for="telefone">Telefone *</label>
                <input type="tel" id="telefone" minlength="14" maxlength="15" required
                        pattern="^\\(\\d{2}\\)\\s\\d{4,5}-?\\d{4}$"
                        placeholder="(XX) XXXXX-XXXX" title="Digite um telefone válido com DDD (8 ou 9 dígitos)">
            `;

            hsPhone.parentNode.insertBefore(telefoneWrapper, hsPhone);
        
            const submitButton = $form.querySelector('.hs-button.primary.large');
            if (corFundo) {
                submitButton.style.backgroundColor = '#'+corFundo;
                submitButton.style.backgroundImage = 'none';
            }
            if (corBotao) submitButton.style.color = corBotao;

            const telefoneInput = $form.querySelector('#telefone');
            telefoneInput.setCustomValidity('');
            
            telefoneInput.addEventListener('input', function(e) {
                const cursorPosition = e.target.selectionStart;
                let value = e.target.value.replace(/\D/g, '');
                const currentValue = e.target.value;
                let formattedValue = '';
                
                if (value.length === 11) formattedValue = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
                else if (value.length === 10) formattedValue = value.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
                else if (value.length > 0) {
                    formattedValue = value.replace(/^(\d{0,2})/, '($1)');
                    if (value.length > 2) {
                        if (value.length <= 6) formattedValue = formattedValue.replace(/(\d{4})$/, ' $1');
                        else if (value.length <= 10) formattedValue = formattedValue.replace(/(\d{4})(\d{0,4})$/, ' $1-$2');
                        else formattedValue = formattedValue.replace(/(\d{5})(\d{0,4})$/, ' $1-$2');
                    }
                }
                
                e.target.value = formattedValue;
                if (currentValue.length > formattedValue.length && cursorPosition > 0) e.target.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
                else e.target.setSelectionRange(formattedValue.length, formattedValue.length);
            });
            
            telefoneInput.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace') {
                    const cursorPosition = e.target.selectionStart;
                    const value = e.target.value;
                    if (cursorPosition > 0 && (value[cursorPosition - 1] === ' ' || value[cursorPosition - 1] === '(' || value[cursorPosition - 1] === ')' || value[cursorPosition - 1] === '-')) {
                        e.preventDefault();
                        e.target.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
                    }
                }
            });
            telefoneInput.addEventListener('keydown', function () { this.setCustomValidity(''); });
            telefoneInput.addEventListener('blur', function () {
                const digits = this.value.replace(/\D/g, '');
                if (digits.length !== 10 && digits.length !== 11) this.setCustomValidity('Digite um telefone válido.');
                else this.setCustomValidity('');
            });

            submitButton.addEventListener('click', function(e) {
                phoneInput.value = telefoneInput.value.replace(/\D/g, '');
                if (nomeInput) validarNome(nomeInput);
                if (emailInput) validarEmail(emailInput);
                if (!$form.checkValidity()) {
                    e.preventDefault(); $form.reportValidity(); return;
                }
            });
        },
        onFormSubmit: function($form) {
            if (!$form.checkValidity()) { $form.reportValidity(); return false; }
            
            var nome = $form.querySelector('[name="nome_ser"]')?.value;
            var email = $form.querySelector('[name="email"]')?.value;
            var phone = $form.querySelector('[name="phone"]')?.value;

            var redirectUrl = formLinkMatch + '?nome=' + encodeURIComponent(nome) + '&email=' + encodeURIComponent(email) + '&telefone=' + encodeURIComponent(phone) + '&bg=1565c0';
            window.top.location.href = redirectUrl;
            return false;
        }
    });
}
