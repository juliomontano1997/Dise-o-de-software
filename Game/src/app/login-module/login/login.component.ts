
import { Component, OnInit,ElementRef, AfterViewInit} from '@angular/core';
import { HttpClient, HttpClientModule,HttpRequest} from '@angular/common/http';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { LoginServiceService } from '../../services/login-service.service';

declare var window: any;
declare var FB: any;
declare var swal:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit,AfterViewInit 
{
    private aplicationId:any;
    private userId:any;
    private imageUrl:string;
    
    constructor(private http:HttpClient,private loginService:LoginServiceService) 
    {
       this.aplicationId='726004681121152';       
    }
  
   
    ngAfterViewInit(): void {
      this.LoadSDK();
    }
    



    public getFacebookInformation() 
    {
      let environment=this;
      FB.api('/me','GET', {fields: 'email,first_name,last_name,name,id,picture.width(150).height(150)'},function (response) {
          environment.imageUrl="https://graph.facebook.com/"+response.id+"/picture?type=normal";
          console.log("respuesta");
          console.log(response.email);
          environment.userSignIn(response,environment.imageUrl);
          
      });
    }

    
    public LoadSDK () {
      let environment=this;
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v2.12';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));


    window.fbAsyncInit = () => {
        console.log("fbasyncinit")

        FB.init({
            appId            : environment.aplicationId,
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v2.10'
        });
        FB.AppEvents.logPageView();

        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                environment.notifyUser();     
                }
                
            else{
                FB.Event.subscribe('auth.statusChange', (response => {

                    if (response.status === 'connected') {
                        console.log("user is logeg");
                        console.log(response)
                        environment.getFacebookInformation();
                        // use the response variable to get any information about the user and to see the tokens about the users session
                    }
                
                      }));
            }
            });

  };
}

public notifyUser(){
    let environment=this;
    swal({
        type:'info',
        title: 'Mensaje de inicio de sesión',
        text: "Usted tiene la sesión abierta, no es necesario que inicie sesión",
        confirmButtonColor: '#049F0C',
        confirmButtonText: 'Ok, continuar',
        }).then(() => {
            environment.getFacebookInformation();
        }, (dismiss) => {
            environment.getFacebookInformation();
        });
}

  //verify if the user exist.
public userSignIn(response:any, imageDir:string)
{
    console.log(response);
    localStorage.setItem("user_data",JSON.stringify(response));

    this.loginService.userRegistration(response.email,response.name,imageDir)
    .subscribe(
        (res) =>{
            console.log("login response");
            console.log(res);
            localStorage.setItem("playerInformation",JSON.stringify(res[0]));
            window.location.href='profileModule';

        },
        (err) => {
          console.log(err.json()); 
        });
}


ngOnInit(){
  if (window.FB) {
    window.FB.XFBML.parse();
}
}

}

