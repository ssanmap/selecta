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
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  })

  // llenar selectores
  regiones: string[] = [];

  paises: PaisSmall[] = [];
  fronteras: PaisSmall[] = [];
  // cargando
  cargando: boolean = false;

  constructor(private fb: FormBuilder,
  private ps: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.ps.regiones;
    // cuando cambie la region
    this.miForm.get('region')?.valueChanges
      .pipe(
        tap(() => {
          this.miForm.get('pais')?.reset('');
          this.miForm.get('frontera')?.disable();
          this.cargando = true;
        }),
        switchMap( region => this.ps.getPaisesPorRegion(region))
       
      )
      // me suscribo a lo que retorna esto que es la llamda 
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
      })
    
        // cuando cambie la pais
        this.miForm.get('pais')?.valueChanges
        .pipe(
          tap(() => {
            this.miForm.get('frontera')?.reset('');
            this.miForm.get('frontera')?.enable();
            this.cargando = true;
          }),
          switchMap(codigo => this.ps.getPaisPorCodigo(codigo)),
          switchMap(pais => this.ps.getPaisesPorCodigos(pais?.borders!))
         
        )
        // me suscribo a lo que retorna esto que es la llamda 
        .subscribe(paises => {
          this.fronteras = paises || [];
          this.cargando = false;
        })
    
    
      
  }
  guardar(): void{
    console.log(this.miForm.value);
  }
}
