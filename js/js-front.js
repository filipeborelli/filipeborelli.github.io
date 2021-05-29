$(function () {

    const select = (el, all = false) => {
        el = el.trim()
        if (all) {
          return [...document.querySelectorAll(el)]
        } else {
          return document.querySelector(el)
        }
    }
    
    const on = (type, el, listener, all = false) => {
    if (all) {
        select(el, all).forEach(e => e.addEventListener(type, listener))
    } else {
        select(el, all).addEventListener(type, listener)
    }
    }

    const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
    }

    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
        if (!navbarlink.hash) return
        let section = select(navbarlink.hash)
        if (!section) return
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
        } else {
        navbarlink.classList.remove('active')
        }
    })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)

    const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
        offset -= 10
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
        top: elementPos - offset,
        behavior: 'smooth'
    })
    }
    
    let selectHeader = select('#header')
    if (selectHeader) {
    const headerScrolled = () => {
        if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
        } else {
        selectHeader.classList.remove('header-scrolled')
        }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
    }
    
    let backtotop = select('.back-to-top')
    if (backtotop) {
    const toggleBacktotop = () => {
        if (window.scrollY > 100) {
        backtotop.classList.add('active')
        } else {
        backtotop.classList.remove('active')
        }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
    }

    on('click', '.mobile-nav-toggle', function(e) {
        select('#navbar').classList.toggle('navbar-mobile')
        this.classList.toggle('bi-list')
        this.classList.toggle('bi-x')
    })

    /**
     * Mobile nav dropdowns activate
     */
    on('click', '.navbar .dropdown > a', function(e) {
        if (select('#navbar').classList.contains('navbar-mobile')) {
        e.preventDefault()
        this.nextElementSibling.classList.toggle('dropdown-active')
        }
    }, true)

    new Swiper('.clients-slider', {
        speed: 400,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        slidesPerView: 'auto',
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        },
        breakpoints: {
          320: {
            slidesPerView: 2,
            spaceBetween: 40
          },
          480: {
            slidesPerView: 3,
            spaceBetween: 60
          },
          640: {
            slidesPerView: 4,
            spaceBetween: 80
          },
          992: {
            slidesPerView: 6,
            spaceBetween: 120
          }
        }
    });
      
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  
    token = localStorage.getItem('token');
    $('#number').mask('00000000000');
  
    $("#testWhatsApp").on('click', () => {
        
        Swal.fire({
            title: "Deseja mesmo continuar?",
            text: "Ná proxima etapa será necessário escanear o QR-CODE do WhatsApp, deseja continuar?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonText: "Não, obrigado",
            confirmButtonText: "Continuar",
            closeOnConfirm: false,
            closeOnCancel: false 
        }).then(function(result) {
  
            if (result.value) {
                if(token == null){
                    token = parseInt(Math.floor(Math.random() * 999990 * 199999));
                    localStorage.setItem('token', token);
                    startSession()
                }else{
                    token = localStorage.getItem('token');
                    getQrCode()
                }
  
                $("#modalWhats").modal('show');
            }
  
        });
  
    });
  
    $('#modalWhats').on('shown.bs.modal', function ( event ) {
        checkStatus();
        myVar = setInterval(() => checkStatus(), 9000);
    })
  
    $('#modalWhats').on('hidden.bs.modal', function ( event ) {
        clearInterval(myVar);
    })
  
    $("#send").click(function () {
        let number = `55${$("#number").val()}`;
        let msg = $("#msg").val();
  
        if( number != '' && msg != ''){
            $.post({
                method: 'POST',
                url: `https://whatsapp.contrateumdev.com.br/sendText`,
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                data: JSON.stringify({
                    sessionName: `session${token}`,
                    number: number,
                    text: msg
                }),
                beforeSend: () => {
                    $('#send').html("Enviando...")
                },
                success: function(resultado, status, xhr) {
                    if (resultado?.result) {
    
                        $('#send').html("Enviar")
  
                        Swal.fire({
                            title: 'Enviada',
                            text: 'Sua mensagem foi enviada com sucesso',
                            icon: 'success',
                            confirmButtonText: 'Nice!'
                        })
  
                        $('#number').val("")
                        $('#msg').val("")
    
                    }else{
  
                        $('#send').html("Enviar novamente")
                        Swal.fire({
                            title: 'Error!',
                            text: 'Mensagem não enviada.',
                            icon: 'error',
                            confirmButtonText: 'Tentar novamente'
                        })
  
                    }
                }
            })
        } else{
  
            Swal.fire({
                title: 'Error!',
                text: 'Preencha todos os campos, número com DDD e mensagem',
                icon: 'error',
                confirmButtonText: 'Tentar novamente'
            })
  
        }
        
    });
  
    $("#sendMail").click(function () {
        let email = $("#email").val();
  
        if(email != ''){
            $.post({
                method: 'POST',
                url: `/api/email/subscribe`,
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                data: JSON.stringify({
                    email: email
                }),
                success: function(resultado, status, xhr) {
                    if (status == 'success') {
                        
                        Swal.fire({
                            title: 'Good!',
                            text: resultado?.message,
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        })
  
                        $('#email').val("")
  
                    }else{
  
                        Swal.fire({
                            title: 'Error!',
                            text: 'E-mail não cadastrado.',
                            icon: 'error',
                            confirmButtonText: 'Tentar novamente'
                        })
                        console.log(resultado)
                    }
                }
            })
        }else{
  
            Swal.fire({
                title: 'Error!',
                text: 'Preencha com um e-mail válido para continuar',
                icon: 'error',
                confirmButtonText: 'Tentar novamente'
            })
  
        }
        
    });

    getStatusServer();
  
  })

  function getStatusServer(){

    $.post({
        method: 'POST',
        url: `https://api.contrateumdev.com.br/status`,
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(resultado, status, xhr) {
            if (resultado) {

                tudoOk = true;
                resultado?.monitors.forEach(function(server){
                    tudoOk = parseInt(server?.status) == 2;
                    switch (parseInt(server?.status)) {
                        case 0:
                            html = `<div class="alert alert-secondary" role="alert" data-aos="fade-up">
                                O serviço <a href="${server?.url}" target="_blank" class="alert-link">${server?.friendly_name}</a>. está pausado para manutenção atualmente.
                            </div>`;
                            break;
                        case 1:
                            html = `<div class="alert alert-info" role="alert" data-aos="fade-up">
                                O serviço <a href="${server?.url}" target="_blank"  class="alert-link">${server?.friendly_name}</a>. ainda não foi verificado.
                            </div>`;
                            break;
                        case 2:
                            html = `<div class="alert alert-success" role="alert" data-aos="fade-up">
                                O serviço <a href="${server?.url}" target="_blank"  class="alert-link">${server?.friendly_name}</a>. está funcionando normalmente.
                            </div>`;
                            break;
                        case 8:
                            html = `<div class="alert alert-warning" role="alert" data-aos="fade-up">
                                O serviço <a href="${server?.url}" target="_blank"  class="alert-link">${server?.friendly_name}</a>. aparentemente está com problemas.
                            </div>`;
                            break;
                        case 9:
                            html = `<div class="alert alert-danger" role="alert" data-aos="fade-up">
                                O serviço <a href="${server?.url}" target="_blank"  class="alert-link">${server?.friendly_name}</a>. está offline, já estamos verificando.
                            </div>`;
                            break;
                        default:
                            break;
                    }
                    $(".list_servers").append(html)
                })

                tudoOk == true ? $(".status_servers").addClass('text-success').html('Todos os sistemas operacionais')
                       : $(".status_servers").addClass('text-danger').html('Alguns sistemas estão desligados')

            }
        }
    })
  }
  
  function startSession(){
  
    $.post({
        method: 'GET',
        url: `https://whatsapp.contrateumdev.com.br/start?sessionName=session${token}`,
        success: function(resultado, status, xhr) {
            if (resultado) {
  
                if( (resultado.message == "STARTING") || (resultado.message == "QRCODE")){
                    $(".img-whats-block").css('display', 'block');
                    $(".whats-block").css('display', 'none');
  
                    $.post({
                        method: 'GET',
                        url: `https://whatsapp.contrateumdev.com.br/qrcode?sessionName=session${token}`,
                        success: function(resultado, status, xhr) {
                            if (resultado) {
  
                                $(".img-whats-block").css('display', 'block');
                                $(".whats-block").css('display', 'none');
                                $(".img-whats-block").html(`<h1> <i class="fas fa-spinner fa-spin"></i> Aguarde ...</h1> `)
                                
                                if(resultado?.qrcode){
                                    $(".img-whats-block").css('display', 'block');
                                    $(".whats-block").css('display', 'none');
  
                                    console.log(resultado?.qrcode)
                                    $(".img-whats-block").html(`<img src="${resultado?.qrcode}" style="margin: 20px;width:250px;"> <br /> <small>Escaneie o código e aguarde ...</small>`)
                                }
  
                            }else{
                                console.log(resultado)
                            }
                        }
                    })
                }
            }else{
                console.log(resultado)
            }
        }
    })
  
  }
  
  function checkStatus(){
  
    $.post({
        method: 'GET',
        url: `https://whatsapp.contrateumdev.com.br/status?sessionName=session${token}`,
        beforeSend: () => {
            $(".img-whats-block").css('display', 'block');
            $(".whats-block").css('display', 'none');
            $(".img-whats-block").html(`<h1> <i class="fas fa-spinner fa-spin"></i> Aguarde ...</h1> `)
        },
        success: function(resultado, status, xhr) {
            
            if(resultado) {
                switch (resultado?.result) {
                    case 'CONNECTED':
                            $(".img-whats-block").css('display', 'none');
                            $(".whats-block").css('display', 'block');
                            $(".img-whats-block").html(``)
                            $(".modal-footer").css('display','block');
                            clearInterval(myVar);
                        break;
  
                    case 'QRCODE':
                        getQrCode()
  
                        break;
                
                    case 'OPENING':
                        closeSession()
                    
                        break;
  
                    case 'NOT_FOUND':
                        startSession()
                        break;
  
                    case 'STARTING':
                        setTimeout(function(){
                            checkStatus()
                        }, 5000);
                        break;
  
                }
            }
            
  
        }, error : (e) => {
  
            Swal.fire({
                title: "WOW!!!",
                text: "Estamos sobrecarregados, volte daqui a 20 minutos...",
                type: "warning",
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: "green",
                confirmButtonText: "Tentar novamente",
                closeOnConfirm: false,
                closeOnCancel: false 
            }).then(function(result) {
    
                if (result.value) {
  
                    localStorage.removeItem('token');
                    window.location.reload()
                    $("#modalWhats").modal("hide")
                    closeSession()
  
                }
    
            });
            
        }
    })
  
  }
  
  function getQrCode(){
  
    $.post({
        method: 'GET',
        url: `https://whatsapp.contrateumdev.com.br/qrcode?sessionName=session${token}`,
        beforeSend: () => {
            $(".modal-footer").css('display','none');
        },
        success: function(resultado, status, xhr) {
            if (resultado) {
  
                if(resultado?.qrcode){
                    $(".img-whats-block").css('display', 'block');
                    $(".whats-block").css('display', 'none');
                    $(".img-whats-block").html(`<img src="${resultado?.qrcode}" style="margin: 20px;width:250px;"> <br /> <button type="button" id="clear" class="btn btn-sm btn-secondary" onclick="localStorage.removeItem('token');window.location.reload();"> Limpar dados </button> <br /> <small> Leia o QR-Code com o  seu WhatsApp e aguarde.  <br />Conheça as políticas do <a href="https://faq.whatsapp.com/" target="_blank"> WhatsApp Inc</a> </small>`)
                }
  
            }else{
                console.log(resultado)
            }
        },
        error: function(data) {
            console.log(data.error)
        }
    })
  
  }
  
  function closeSession(){
    $.post({
        method: 'GET',
        url: `https://whatsapp.contrateumdev.com.br/close?sessionName=session${token}`,
        success: function(resultado, status, xhr) {
            if (resultado) {
                console.log(resultado)
            }
        },
        error: function(data) {
            console.log(data.error)
        }
    })
  }
  /* 
  grecaptcha.ready(function() {
    grecaptcha.execute('6LfPv58aAAAAAOxggKWnnws03NshyMazd_G9bi3o', {action:'validate_captcha'})
                .then(function(token) {
        // add token value to form
        document.getElementById('g-recaptcha-response').value = token;
    });
  }); */
