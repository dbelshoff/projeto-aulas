import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './page-not-found.component.html',
  styles: `
div {
background-color: #f8f9fa;
text-align: center;
}

h1 {
color: red;
font-size: 50px;
margin-top: 50px;
}

P{
font-size: 24px;
}

img {
width: 100px;
margin-top: 20px;
}`,
})
export class PageNotFoundComponent {}
