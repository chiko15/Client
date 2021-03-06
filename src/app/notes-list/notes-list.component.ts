import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

import {
  NoteService
} from '../services/note.service';

import {
  AuthService
} from '../services/auth.service';

import {
  ActivatedRoute
} from '@angular/router';

import {
  Router
} from '@angular/router';
import {

  PaginationInstance
} from 'ngx-pagination';


@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent implements OnInit {

  user: any = this.authService.currentUser;
  allTheNotes: Array<any> = [];
  noteResults: Array<any> = this.allTheNotes;
  favoriteNotes: any = [];
  singleNote: any;
  searchText: any;
  newNote: any = {
    user: '',
    title: '',
    text: '',
    status: 'Unfinished',
    urgency: '',
    category: '',
    date: Date.now(),
    theme: '',
    format: ''
  };

  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1
  };

  constructor(private noteService: NoteService,
    private authService: AuthService,
    private router: Router) {}

  ngOnInit() {
    this.authService.isLoggedIn()
      .toPromise()
      .then(() => {
        this.user = this.authService.currentUser;
        if (this.user.userInfo === null) {
          this.router.navigate(['/welcome']);
        }
      })
      .catch(err => {
        this.router.navigate(['/welcome']);
      });

      this.noteService.getFavorites()
      .toPromise()
      .then((favorites) => {
        this.favoriteNotes = favorites;
      });

      this.getAllTheNotes();
    }

  logout() {
    this.authService.logout();
  }

  getOneNote(noteId) {
    this.noteService.getOneNote(noteId)
      .subscribe((theNote) => {
        this.singleNote = theNote;
      });
  }

  myNotes(theId, noteId): void {
    this.noteService.favoriteNote(theId, noteId)
      .subscribe((favorite) => {
        this.favoriteNotes = favorite;
      });
      this.refresh();
  }

  getAllTheNotes(): void {
    this.noteService.getAllNotes()
      .subscribe((theList) => {
        this.allTheNotes = theList;
      });
    this.noteService.getFavorites();
  }

  search(searchText) {
    this.noteResults = this.allTheNotes.filter(notes => {
      console.log('===============================', notes.title);
      return notes.title.toLowerCase().includes(searchText.toLowerCase());
    });
    this.getAllTheNotes();
  }

  deleteNote(theId): void {
    this.noteService.deleteNote(theId)
      .subscribe(() => {
        this.getAllTheNotes();
      });
  }

  addNewNote(): void {
    this.noteService.createNote(this.newNote)
      .subscribe(() => {
        this.getAllTheNotes();
      });
      this.router.navigate(['/user']);
  }

  refresh(): void {
    window.location.reload();
  }
}
