import { UsuarioExisteService } from './usuario-existe.service';
import { NovoUsuarioService } from './novo-usuario.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NovoUsuario } from './novo-usuario';
import { minusculoValidator } from './minusculo.validator';
import { usuarioSenhaIguaisValidator } from './usuario-senha-iguais.validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-novo-usuario',
  templateUrl: './novo-usuario.component.html',
  styleUrls: ['./novo-usuario.component.css']
})
export class NovoUsuarioComponent implements OnInit {
  novoUsuarioForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private novoUsuarioService: NovoUsuarioService,
    private usuarioExisteService: UsuarioExisteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.novoUsuarioForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required, Validators.minLength(4)]],
      userName: ['', [minusculoValidator], [this.usuarioExisteService.usuarioJaExiste()]],
      password: [''],
    },
    {
      validators: [usuarioSenhaIguaisValidator]
    });
  }

  cadastrar() {
    // Verifica se o form está válido.
    if(this.novoUsuarioForm.valid) {
      const novoUsuario = this.novoUsuarioForm.getRawValue() as NovoUsuario;
      // Chama o service para cadastrar, que retornará uma observable.
      this.novoUsuarioService.cadastraNovoUsuario(novoUsuario).subscribe(
        // Caso a chamada tenha tido sucesso, usuário será redirecionado.
        () => {
          this.router.navigate(['']);
        },
        // Caso algum erro tenha acontecido durante a chamada.
        (error) => {
          console.log(error);
        }
      );
    }
  }

}
