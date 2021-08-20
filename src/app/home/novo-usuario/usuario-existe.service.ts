import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { NovoUsuarioService } from './novo-usuario.service';
import { first, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioExisteService {

  constructor(private novoUsuarioService: NovoUsuarioService) { }

  // Essa função vai mapear a cada mudança na string do controle,
  // convertendo cada evento em uma chamada http,
  // retornando um objeto de validação.
  usuarioJaExiste() {

    // Recebe o Control que será observador.
    return (control: AbstractControl) => {

      // Resgata o value do controle informado a cada alteração do mesmo.
      // É então chamado o operador pipe para realizar uma sequência de
      // ações com os resultados subsequentes.
      return control.valueChanges.pipe(

        // Switchmap realiza a trocar do fluxo, pegando o value do retorno
        // anterior e utilizando o mesmo para a chamada do serviço que
        // realiza o http.get no backend, o retorno dessa chamada é um
        // booleano.
        switchMap((nomeUsuario) => {
          return this.novoUsuarioService.verificaUsuarioExistente(nomeUsuario)
        }),

        // O operador Map resgata o retorno do passo anterior, retornando
        // um objeto de validação dependendo do valor booleano recebido.
        map((usuarioExiste) => {
          return usuarioExiste ? { usuarioExistente: true } : null
        }),

        // Encerra o fluxo de validação.
        first()
      );
    }
  }
}

