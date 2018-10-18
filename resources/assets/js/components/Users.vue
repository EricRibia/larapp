<template>

        <div class="row mt-5">
          <div class="col-md-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Users table</h3>

                <div class="card-tools">
                  <button class="btn btn-success" @click="newModal">Add user <i class="fas fa-user-plus fa-fw"></i></button>
                </div>
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <tbody><tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Registered at</th>
                    <th>Modify</th>
                  </tr>
                  <tr v-for=" user in users" :key="user.id">
                    <td>{{user.id}}</td>
                    <td>{{user.name}}</td>
                    <td>{{user.email}}</td>
                    <td>{{user.type | upText}}</td>
                    <td>{{user.created_at | fDate}}</td>
                    <td>
                        <a href="#" @click="editModal(user)"><i class="fas fa-edit"></i></a>
                          /  
                        <a href="#" @click="deleteUser(user.id)"><i class="fas fa-trash-alt"></i></a>
                    </td>
                  </tr>
                </tbody></table>
              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div>
          <!-- Modal -->
            <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 v-show="editMode" class="modal-title" id="addNewLabel">Update user's info</h5>
                    <h5 v-show="!editMode" class="modal-title" id="addNewLabel">Create a user</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form @submit.prevent="editMode ? updateUser() : createUser()">
                <div class="modal-body">
                    <div class="form-group">
                        <input v-model="form.name" type="text" name="name"
                            placeholder="Enter name"
                            class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                        <has-error :form="form" field="name"></has-error>
                    </div>
                    <div class="form-group">
                        <input v-model="form.email" type="email" name="email"
                            placeholder="Email address"
                            class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                        <has-error :form="form" field="email"></has-error>
                    </div>
                    <div class="form-group">
                        <input v-model="form.password" type="password" name="password"
                            placeholder="Password"
                            class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                        <has-error :form="form" field="password"></has-error>
                    </div>
                    <div class="form-group">
                        <select v-model="form.type" type="text" name="type"
                            class="form-control" :class="{ 'is-invalid': form.errors.has('type') }">
                        <option value="">Select user type</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="author">Author</option>
                        </select>
                        <has-error :form="form" field="type"></has-error>
                    </div>
                    <div class="form-group">
                        <textarea v-model="form.bio" type="text" name="bio"
                            rows="3"
                            placeholder="Enter bio (optional)"
                            class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }">
                        </textarea>
                        <has-error :form="form" field="bio"></has-error>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button v-show="editMode" type="submit" class="btn btn-success">Update</button>
                    <button v-show="!editMode" type="submit" class="btn btn-primary">Create</button>
                </div>
                </form>
                </div>
            </div>
            </div>
        </div>

</template>

<script>
    export default {
        
        data(){
            return {
                editMode : false,
                users: {},
                form : new Form({
                    id:'',
                    name: '',
                    email: '',
                    password: '',
                    type: '',
                    bio: '',
                    photo: ''
                })
            }
        },
        methods: {
            newModal(){
               this.editMode = false;
                this.form.reset();
                this.form.clear();
                $('#addNew').modal('show');
                 
            },
            editModal(user){
                this.editMode = true;
                this.form.reset();
                $('#addNew').modal('show');
                this.form.clear();
                this.form.fill(user);
                
            },
            deleteUser(id){
                swal({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if(result.value){
                        this.form.delete('api/user/' + id)
                        .then( () => {
                            swal(
                            'Deleted!',
                            'User has been deleted.',
                            'success'
                            )
                        Fire.$emit('createUser');
                        }).catch( () => {
                            swal({
                            type: 'error',
                            title: 'Failed',
                            text: 'Something went wrong!',
                            })
                        });
                    }
                })
            },
            loadUsers(){
                axios.get('api/user').then(( {data} ) => (this.users = data.data));
            },
            updateUser(){
                this.$Progress.start();
                this.form.put( 'api/user/' + this.form.id)
                .then( () => {
                    //success
                    $('#addNew').modal('hide');
                    swal(
                        'Updated!',
                        'User has been updated.',
                        'success'
                        )
                    Fire.$emit('createUser');
                    this.$Progress.finish();
                }).catch( () => {
                    //fail
                    this.$Progress.start();
                });
            },
            createUser(){
                this.$Progress.start();
                this.form.post('api/user')
                .then( () => {
                    $('#addNew').modal('hide');
                    toast({
                        type: 'success',
                        title: 'User created successfully!!'
                        });
                    Fire.$emit('createUser');
                    this.$Progress.finish();
                }).catch( () => {

                });
            }
        },
        created() {
            this.loadUsers();
            Fire.$on('createUser', () => this.loadUsers() );
            // setInterval( () => this.loadUsers(), 3000);
        }
    }
</script>
