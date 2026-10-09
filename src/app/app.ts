import { Component, AfterViewInit } from '@angular/core';
import { College360, Location } from './services/college360';
import { forkJoin } from 'rxjs';

declare var pannellum: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {

    locations: Location[] = [];

  currentLocation = 'Main Entrance';

  private viewer: any;

  isDestinationOpen = false;

  private startLocationId = 1;


  constructor(private college360: College360) {}


    ngAfterViewInit(): void {

    const params = new URLSearchParams(window.location.search);
    const startParam = params.get('start');
    this.startLocationId = startParam ? Number(startParam) : 1;

    forkJoin({
      locations: this.college360.getLocations(),
      navigations: this.college360.getNavigations()
    }).subscribe({

      next: (data) => {

                this.locations = data.locations;

        const startLocation = this.locations.find(
          location => location.id === this.startLocationId
        );

        if (startLocation) {
          this.currentLocation = startLocation.name;
        }

        const scenes: any = {};


        data.locations.forEach(location => {

          const locationNavigations =
            data.navigations.filter(
              navigation =>
                navigation.fromLocationId === location.id
            );


          const hotSpots =
            locationNavigations.map(navigation => {

              const cssClass =
                navigation.direction.toLowerCase() === 'backward'
                  ? 'back-navigation-arrow'
                  : 'navigation-arrow';


              return {

  pitch: navigation.pitch,

  yaw: navigation.yaw,

  type: 'scene',

  text: '',

  cssClass: cssClass,

  sceneId:
    `location${navigation.toLocationId}`,

  targetPitch:
    navigation.pitch,

  targetYaw:
    navigation.entryYaw

};

            });


          scenes[`location${location.id}`] = {

            type: 'equirectangular',

            panorama: location.imagePath,

            hotSpots: hotSpots

          };

        });


        this.viewer =
          pannellum.viewer('panorama', {

            default: {

              firstScene: `location${this.startLocationId}`,

              autoLoad: true

            },

            scenes: scenes

          });

      },


      error: (error) => {

        console.error(
          'Error loading College 360 data:',
          error
        );

      }

    });

  }


  goToLocation(locationId: string): void {

    if (!locationId) {
      return;
    }


    const currentSceneId =
      this.viewer.getScene();


    const currentLocationId =
      Number(
        currentSceneId.replace('location', '')
      );


    this.college360.getNavigations().subscribe({

      next: (navigations) => {

        const navigation =
          navigations.find(
            navigation =>
              navigation.fromLocationId ===
                currentLocationId
              &&
              navigation.toLocationId ===
                Number(locationId)
          );


        if (navigation) {
          console.log('Navigation:', navigation);

          this.viewer.loadScene(
          `location${locationId}`,
          navigation.pitch,
          navigation.entryYaw
        );

        }

        else {

          this.viewer.loadScene(
            `location${locationId}`
          );

        }


        const selectedLocation =
          this.locations.find(
            location =>
              location.id.toString() === locationId
          );


        if (selectedLocation) {

          this.currentLocation =
            selectedLocation.name;

        }


        this.isDestinationOpen = false;

      },


      error: (error) => {

        console.error(
          'Error loading navigation:',
          error
        );

      }

    });

  }


  toggleDestination(): void {

    this.isDestinationOpen =
      !this.isDestinationOpen;

  }

}