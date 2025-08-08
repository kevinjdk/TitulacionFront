import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  // Información
  creators = [
    {
      name: 'Alejandro Llumiquinga',
      role: 'Developer',
      github: 'https://github.com/xavierGMFT',
      linkedin: 'https://www.linkedin.com/in/alejandro-llumiquinga-855122377/'
    },
    {
      name: 'Kevin Holguin',
      role: 'Developer', 
      github: 'https://github.com/kevinjdk',
      linkedin: 'https://www.linkedin.com/in/kevinjordanholguin/'
    }
  ];

  // Redes sociales de la página
  socialLinks = [
    {
      name: 'Facebook',
      icon: 'pi pi-facebook',
      url: 'https://www.facebook.com/profile.php?id=61578610723604&sk=grid'
    },
    {
      name: 'Instagram', 
      icon: 'pi pi-instagram',
      url: 'https://www.instagram.com/reectas/'
    },
    {
      name: 'Twitter',
      icon: 'pi pi-twitter',
      url: 'https://x.com/reECtas593'
    }
  ];
}
