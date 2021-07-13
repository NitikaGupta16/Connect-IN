window.addEventListener( 'load', () => {
 
    // Register User event 
    const form = document.getElementById('register')
        if(form!==null)
        {
            
        form.addEventListener('submit', registerUser)
        }

        else
        {
            
        }
        async function registerUser(event) {
            event.preventDefault()
            const username = document.getElementById('create_username').value
            const password = document.getElementById('create_password').value
            const formType = 'register';

            const result = await fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    formType
                })
            }).then((res) => res.json())

            if (result.status === 'ok') {
                // everything went fine
                alert('You are sucessfully registered now. Please')
                $('#register_form').modal('hide');
            } else {
                alert(result.error)
            }
        }


    // login User event 
    const form1 = document.getElementById('login')
        if(form1!==null)
        {
            form1.addEventListener('submit', login)
        }

        async function login(event) 
        {
            event.preventDefault()
            const username = document.getElementById('username').value
            const password = document.getElementById('password').value
            const formType = 'login';

            const result = await fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    formType
                })
            }).then((res) => res.json())

            if (result.status === 'ok') {
                // everything went fine
                document.cookie = 'token=' + result.data;
                $('.login_name_fader').html('Welcome Back '+ username+'!');
                $('form').fadeOut(500);
                $('.wrapper').addClass('form-success');

                window.setTimeout(function(){

                    // Move to a new location or you can do something else
                    window.location.href = `${ location.origin }/profile`;
            
                }, 2000);
            } else {
                alert(result.error)
            }
        }

});
