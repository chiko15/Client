import {
  Component,
  OnInit
} from '@angular/core';
import {
  TeamService
} from '../services/team.service';
import {
  NoteService
} from '../services/note.service';
import {
  AuthService
} from '../services/auth.service';
import {
  ActivatedRoute, Router
} from '@angular/router';
import {
  PaginationInstance
} from 'ngx-pagination';

@Component({
  selector: 'app-team-notes-list',
  templateUrl: './team-notes-list.component.html',
  styleUrls: ['./team-notes-list.component.css']
})
export class TeamNotesListComponent implements OnInit {

  user: any = this.authService.currentUser;
  isShowing: Boolean = false;
  allTheNotes: Array < any > = [];
  teamNotes: any = [];
  theUpdate: any = {};
  body: any = {username: ''};
  theTeam: any = {
    user: [''],
    note: [''],
    teamName: '',
    urgency: '',
    status: '',
    theme: ['']
  };
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

  constructor(
    private myService: TeamService,
    private noteService: NoteService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const theId = (params['id']);
      this.myService.getOneTeam(theId)
        .subscribe((responseFromService) => {
          this.theTeam = responseFromService;
          this.myService.getTeamNotes(this.theTeam._id)
          .subscribe((notes) => {
            this.teamNotes = notes;
          });
        });
      });

    this.authService.isLoggedIn()
    .toPromise()
    .then(() => {
      this.user = this.authService.currentUser;
      if (this.user.userInfo === null) {
        this.router.navigate(['/welcome']);
      }
    })
    .catch(err => {
      console.log('err in notes: ', err);
      this.router.navigate(['/welcome']);
    });


  }

  toggleForm() {
    this.isShowing = !this.isShowing;
  }

  getOneTeam(theId) {
    this.myService.getOneTeam(theId)
      .subscribe((response) => {
        this.theTeam.note = response;
      });
  }

  addNewNote() {
    this.noteService.createNote(this.newNote)
      .subscribe(() => {
      });
      this.myService.updateTeamNotes(this.theTeam._id, this.newNote)
      window.location.reload();
  }

  updateThisTeam(theId) {
    this.myService.updateTeam(theId, this.theUpdate)
      .subscribe(() => {
        this.getOneTeam(theId);
        this.theUpdate = {};
      });
  }

  updateTeamsNotes(theTeamId) {
    this.myService.updateTeamNotes(theTeamId, this.addNewNote())
    .subscribe(() => {
      this.getOneTeam(theTeamId);
      // this.newNote.title = '';
    });
  }

  addUser(teamId) {
    this.myService.addUserToTeam(teamId, this.body)
    .subscribe(() => {
      this.myService.getAllTeams();
    });
  }

  refresh(): void {
    window.location.reload();
  }

}
