import { Component, OnInit } from '@angular/core';
import { Usuario } from './Models/Usuario.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  usuarios: Usuario[] = [];
  nuevoUsuario: Usuario = { id: 0, nombre: '', email: '', empresa: '' };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerUsuario();
  }

  obtenerUsuario() {
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/users').subscribe(data => {
      this.usuarios = data.map(user => ({
        id: user.id,
        nombre: user.name,
        email: user.email,
        empresa: user.company.name
      }));
    });
  }

  agregarUsuario() {
    const body = {
      id: this.nuevoUsuario.id,
      name: this.nuevoUsuario.nombre,
      email: this.nuevoUsuario.email,
      company: {
        name: this.nuevoUsuario.empresa
      }
    };

    this.http.post('https://jsonplaceholder.typicode.com/users', body).subscribe(response => {
      console.log('Usuario Agregado', response);
      this.usuarios.push(this.nuevoUsuario);
      this.nuevoUsuario = { id: 0, nombre: '', email: '', empresa: '' };
    });
  }

  eliminarFila(id: number) {
    this.http.delete(`https://jsonplaceholder.typicode.com/users/${id}`).subscribe(response => {
      this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
      alert('Usuario eliminado correctamente');
    }, error => {
      console.error('Error al eliminar el usuario:', error);
      alert('Error al eliminar el usuario');
    });
  }

  actualizarUsuario() {
    const body = {
      id: this.nuevoUsuario.id,
      name: this.nuevoUsuario.nombre,
      email: this.nuevoUsuario.email,
      company: {
        name: this.nuevoUsuario.empresa
      }
    };

    this.http.put(`https://jsonplaceholder.typicode.com/users/${this.nuevoUsuario.id}`, body)
      .subscribe(response => {
        console.log('Usuario actualizado', response);
        const index = this.usuarios.findIndex(usuario => usuario.id === this.nuevoUsuario.id);
        if (index !== -1) {
          this.usuarios[index] = { ...this.nuevoUsuario };
        }
        this.cancelarEdicion();
      }, error => {
        console.error('Error al actualizar el usuario:', error);
        alert('Error al actualizar el usuario');
      });
  }

  editarUsuario(usuario: Usuario) {
    this.nuevoUsuario = { ...usuario }; // Carga el usuario seleccionado para editar
  }

  cancelarEdicion() {
    this.nuevoUsuario = { id: 0, nombre: '', email: '', empresa: '' }; // Reinicia el formulario
  }
}


