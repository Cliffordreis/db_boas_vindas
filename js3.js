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
    let hFrame = iframeDiv.parentElement.clientHeight || 1000;
    
    const formHTML = `
        <style>
        #hubspotForm, #hubspotForm iframe {
            width: 100% !important; 
            height: 350px !important;
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
                .hbspt-form {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: transparent;
                    padding: 10px;
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
                    width: 100%; padding: 12px 16px !important;
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

document.addEventListener('DOMContentLoaded', () => {

    const btnComprar = document.getElementById('btn-comprar');
    const popup = document.getElementById('popup-form');
    const fecharPopup = document.getElementById('fechar-popup');

    if (popup) {
        document.body.appendChild(popup);
    }

    btnComprar.addEventListener('click', () => {
        popup.classList.remove('hidden');
        popup.classList.add('flex');
        
        initializeDynamicForms();
    });

    fecharPopup.addEventListener('click', () => {
        popup.classList.add('hidden');
        popup.classList.remove('flex');
    });

    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.add('hidden');
            popup.classList.remove('flex');
        }
    });

    const urlDoCurso = 'https://posead.uninassau.edu.br/nossos-cursos/especializacao-em-educacao-especial-e-inclusiva/453/60/digital';
    const meuWorkerCloudflare = 'https://dry-frost-ff38.cliffordreis69.workers.dev/'; 
    const urlProxy = meuWorkerCloudflare + '?url=' + encodeURIComponent(urlDoCurso);

    const containerOpcoes = document.getElementById('payment-options-container');
    const elTitulo = document.getElementById('curso-titulo');

    function limparNomes(texto) { return texto ? texto.replace(/\s+/g, ' ').trim() : ""; }
    function capitalizarTitulo(texto) { return texto ? texto.toLowerCase().replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : ""; }

    fetch(urlProxy)
        .then(r => {
            if(!r.ok) throw new Error("Falha na resposta do proxy");
            return r.text();
        })
        .then(html => {
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const tituloRaw = doc.querySelector('h1.prematricula-title');
                elTitulo.textContent = tituloRaw ? capitalizarTitulo(limparNomes(tituloRaw.textContent)) : "Especialização (Nome não encontrado)";
                elTitulo.classList.remove('skeleton-text');

                const cardsDeOferta = doc.querySelectorAll('.card-oferta');
                if(cardsDeOferta.length === 0){
                    containerOpcoes.innerHTML = `<div class="!p-6 text-center text-red-500 border-2 border-red-100 rounded-xl bg-red-50 !text-lg">As opções de pagamento não estão disponíveis no momento.</div>`;
                    btnComprar.innerText = 'Prosseguir para inscrição';
                    btnComprar.disabled = false;
                    return;
                }

                containerOpcoes.innerHTML = "";

                cardsDeOferta.forEach((card) => {
                    const tituloTagEl = card.querySelector('.flex9') || card.querySelector('.card-oferta__header');
                    const tagPromo = tituloTagEl ? limparNomes(tituloTagEl.textContent) : "";
                    const precoAntigoEl = card.querySelector('.card-oferta__valor--bold');
                    const precoAntigo = precoAntigoEl ? limparNomes(precoAntigoEl.textContent) : "";
                    const precosNovosEls = card.querySelectorAll('.card-oferta__valores');
                    let precoNovo = "";
                    precosNovosEls.forEach(el => { const t = limparNomes(el.textContent); if(t) precoNovo = t; });
                    const tipoEl = card.querySelector('.card-oferta__text--base');
                    const formaPagamento = tipoEl ? limparNomes(tipoEl.textContent) : "";

                    if (precoNovo) {
                        const div = document.createElement('div');
                        div.className = "payment-option border-slate-100 bg-white !p-6 rounded-xl flex justify-between items-center border-2";
                        div.innerHTML = `
                            <div class="flex items-center gap-4">
                                <div>
                                    <p class="font-bold text-slate-900 !text-3xl">${precoNovo}</p>
                                    <p class="!text-lg text-slate-500 mt-1">${formaPagamento}</p>
                                    ${tagPromo && tagPromo !== 'MÊS DO CONSUMIDOR' ? `<p class="!text-sm text-[#1565C0] font-bold mt-1">${tagPromo}</p>` : ''}
                                </div>
                            </div>
                            ${precoAntigo ? `<span class="bg-red-50 border border-red-100 text-red-500 line-through !text-sm font-bold px-3 py-1 rounded-lg">De ${precoAntigo}</span>` : ''}
                        `;
                        containerOpcoes.appendChild(div);
                    }
                });

                btnComprar.disabled = false;
                
            } catch (erroInterno) {
                console.error("Erro ao processar os dados do site:", erroInterno);
            }
        })
        .catch(err=>{
            console.error("Erro na requisição:", err);
            containerOpcoes.innerHTML = `<div class="!p-6 text-center text-slate-500 !text-lg">Erro ao comunicar com o servidor. Verifique o console.</div>`;
            elTitulo.textContent = "Erro de conexão";
            elTitulo.classList.remove('skeleton-text');
        });
});