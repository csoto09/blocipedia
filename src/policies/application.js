module.exports = class ApplicationPolicy {

  // #1
   constructor(user, record) {
     this.user = user;
     this.record = record;
   }
 
  // #2
   _isOwner() {
     return this.record && (this.record.userId == this.user.id);
   }

   _isCollaborator() {
     return this.record && this.record.collaborators.find((collaborator) => collaborator.userId == this.user.id)
   }

   _isPremium() {
    return this.user && this.user.role == "1";   
   }
 
   _isAdmin() {
     return this.user && this.user.role == "2";
   }
 
  // #3
   new() {
     return this.user != null;
   }
 
   create() {
     return this.new();
   }
 
   show() {
     if(this.record.private !== true) { return true; } 
     else {
      return this.edit()
     }
   }
 
  // #4
   edit() {
     return this.new() &&
       this.record && (this._isOwner() || this._isAdmin() || this._isCollaborator());
   }
 
   update() {
     return this.edit();
   }
 
  // #5
   destroy() {
     return this.update();
   }
 }