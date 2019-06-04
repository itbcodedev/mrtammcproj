import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule } from '../ui/ui.module';
import { GooglemapComponent } from './googlemap/googlemap.component';
import { EditorComponent } from './editor/editor.component';
import { AgGridModule } from 'ag-grid-angular';
import { OpenstreetmapComponent } from './openstreetmap/openstreetmap.component';
import { GtfsrtComponent } from './gtfsrt/gtfsrt.component';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    AgGridModule.withComponents(null)
  ],
  declarations: [GooglemapComponent, EditorComponent, OpenstreetmapComponent, GtfsrtComponent]
})
export class GtfsModule { }
