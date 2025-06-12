import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Address, Position } from '../models/Address';

import { MouseEventEmitService } from '../services/mouse-event-emit.service';

// declare var google: { maps: { MapTypeId: { ROADMAP: any; }; Map: new (arg0: any, arg1: { center: any; zoom: number; disableDefaultUI: boolean; mapTypeControl: boolean; streetViewControl: boolean; zoomControl: boolean; fullscreenControl: boolean; mapTypeId: any; styles: { featureType: string; stylers: { visibility: string; }[]; }[]; }) => any; Marker: new (arg0: { map: any; position: any; }) => any; }; };
declare var google: any;
@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit, AfterViewInit {
  @Input() address: Address;
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  map: any;
  constructor(
    private mouseEventEmitService: MouseEventEmitService
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit(){
    this.addMap(this.address);
  }

  addMap(address: Address){
    let mapOptions = {
      center: address.position,
      zoom: 16,
      disableDefaultUI: true,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: false,
      fullscreenControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          "featureType": "poi",
          "stylers": [
            { "visibility": "off" }
          ]
        }
      ]
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    let marker = new google.maps.Marker({
      map: this.map,
      position: address.position
    });

    marker.infowindow = this.infoWindow(address);
    marker.addListener('click', ()=>{
      marker.infowindow.open(this.map, marker);
    })

    this.mouseEventEmitService.get().subscribe(check=>{
      if(check){
        marker.infowindow.open(this.map, marker);
      }else{
        marker.infowindow.close();
      }
    });
  }

  infoWindow(address: Address){
    const contentString = 
    '<div id="content">'+
    address.street
    '</div>';

    const infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    return infowindow;
  }

}
