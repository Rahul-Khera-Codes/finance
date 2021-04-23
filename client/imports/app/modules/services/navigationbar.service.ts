import {
	Observable
, 
	Subject
} from 'rxjs';
import {
	Injectable
} from '@angular/core';
@Injectable()
export class SharedNavigationService {
	// Observable string sources
	private emitChangeSource = new Subject < any > ();
	// Observable string streams
	changeEmitted$ = this.emitChangeSource.asObservable();
	// Service message commands
	emitChange(change: any) {
		this.emitChangeSource.next(change);
	}
}
