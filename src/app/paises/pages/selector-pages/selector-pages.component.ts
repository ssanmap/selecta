import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';
import {switchMap, tap} from 'rxjs/operators'

@Component({
  selector: 'app-selector-pages',
  templateUrl: './selector-pages.component.html',
  styleUrls: ['./selector-pages.component.css']
})
export class SelectorPagesComponent implements OnInit {
  miForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required]
  })

  // llenar selectores
  regiones: string[] = [];

  paises: PaisSmall[] = [];
  constructor(private fb: FormBuilder,
  private ps: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.ps.regiones;
    // cuando cambie la region
    this.miForm.get('region')?.valueChanges
      .pipe(
        tap(() => {
          this.miForm.get('pais')?.reset('');
        }),
        switchMap( region => this.ps.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
      })
  }
  guardar(): void{
    console.log(this.miForm.value);
  }
}
