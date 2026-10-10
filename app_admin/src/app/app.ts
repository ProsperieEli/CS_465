import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TripListing} from './trip-listing/trip-listing';

@Component({
  imports: [RouterOutlet, TripListing],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  title =
    ('Travlr Getaways Admin!');
}
