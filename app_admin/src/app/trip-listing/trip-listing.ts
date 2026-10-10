import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripCard } from '../trip-card/trip-card';
import { Trip } from '../models/trip';
import { TripData } from '../services/trip-data';
import {Router} from '@angular/router';

@Component({
  imports: [CommonModule, TripCard],
  selector: 'app-trip-listing',
  styleUrl: './trip-listing.css',
  templateUrl: './trip-listing.html',
  providers: [TripData],
})
export class TripListing implements OnInit {
  trips: Trip[] = [];
  message: string = '';

constructor(
  private tripData: TripData,
  private cd: ChangeDetectorRef,
  private router: Router
) {
  console.log('trip-listing constructor');
}
  public AddTrip(): void {
    this.router.navigate(['add-trip']);
  }
  
  private getStuff(): void {
    this.tripData.getTrips().subscribe({
      next: (value: Trip[]) => {
        this.trips = value;
        this.cd.detectChanges();
        if (value.length > 0) {
          this.message = 'There are ' + value.length + ' trips available.';
        } else {
          this.message = 'There were no trips retrieved from the database';
        }

        console.log(this.message);
      },
      error: (error: any) => {
        console.log('Error:', error);
      },
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.getStuff();
  }
}