<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <span class="md-title">
          <md-icon>group</md-icon>
          Vue Employee Data App
          <md-icon>chevron_right</md-icon>
          Employees
        </span>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          Navigation
        </md-toolbar>

        <md-list>
          <md-list-item>
            <md-icon>pie_chart</md-icon>
            <span class="md-list-item-text">Summary</span>
          </md-list-item>

          <md-list-item>
            <md-icon>view_list</md-icon>
            <span class="md-list-item-text">Employees</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <div class="md-layout">
          <form novalidate md-card class="md-layout-item md-size-100" @submit.prevent="validateEmployee">
            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-25">
                  <md-avatar :class="getAvatarClass()">
                    <img v-if="form.pictureURL" :src="form.pictureURL" alt="Profile Picture" @click="onSelectPicture">
                    <img v-else src="./assets/placeholder.png" alt="Profile Picture" @click="onSelectPicture">
                    <input type="file" style="display: none" ref="pictureInput" accept="image/*" @change="onPictureSelected">
                  </md-avatar>
                </div>

                <div class="md-layout-item md-size-75">
                  <div class="md-layout md-gutter">
                    <div class="md-layout-item md-small-size-100">
                      <md-field :class="getValidationClass('firstName')">
                        <label for="first-name">First Name</label>
                        <md-input name="first-name" id="first-name" autocomplete="given-name" v-model="form.firstName" :disabled="formDisabled" />
                        <span class="md-error" v-if="!$v.form.firstName.required">The first name is required</span>
                        <span class="md-error" v-else-if="!$v.form.firstName.minlength">Invalid first name</span>
                      </md-field>
                    </div>

                    <div class="md-layout-item md-small-size-100">
                      <md-field :class="getValidationClass('lastName')">
                        <label for="last-name">Last Name</label>
                        <md-input name="last-name" id="last-name" autocomplete="family-name" v-model="form.lastName" :disabled="formDisabled" />
                        <span class="md-error" v-if="!$v.form.lastName.required">The last name is required</span>
                        <span class="md-error" v-else-if="!$v.form.lastName.minlength">Invalid last name</span>
                      </md-field>
                    </div>
                  </div>

                  <div class="md-layout md-gutter">
                    <div class="md-layout-item md-small-size-100">
                      <md-field :class="getValidationClass('age')">
                        <label for="age">Age</label>
                        <md-input type="number" id="age" name="age" autocomplete="age" v-model="form.age" :disabled="formDisabled" />
                        <span class="md-error" v-if="!$v.form.age.required">The age is required</span>
                        <span class="md-error" v-else-if="!$v.form.age.maxlength">Invalid age</span>
                      </md-field>
                    </div>

                    <div class="md-layout-item md-small-size-100">
                      <md-field :class="getValidationClass('country')">
                        <label for="country">Country</label>
                        <md-select name="country" id="country" v-model="form.country" md-dense :disabled="formDisabled">
                          <md-option v-for="country in countries" v-bind:key="country.code" v-bind:value="country.code">
                            {{country.name}}
                          </md-option>
                        </md-select>
                        <span class="md-error">The country is required</span>
                      </md-field>
                    </div>
                  </div>
                </div>
              </div>

            </md-card-content>

            <md-progress-bar md-mode="indeterminate" v-if="sending" />

            <md-card-actions>
              <md-button v-if="!formDisabled" type="submit" class="md-primary" :disabled="formDisabled">Create employee</md-button>
              <md-button v-if="formDisabled" class="md-primary" @click="clearForm">Deselect {{ getFullName(form) }}</md-button>
            </md-card-actions>
          </form>
          <md-snackbar :md-active.sync="employeeSaved">The employee {{ lastEmployee }} was saved with success!</md-snackbar>
          <md-snackbar :md-active.sync="fileError">Please add a valid file!</md-snackbar>

          <md-table md-card md-fixed-header class="md-layout-item md-size-100" v-model="filteredEmployee" @md-selected="onSelectEmployee">
            <md-table-toolbar>
              <md-field>
                <label for="letters">Filter (A-Z)</label>
                <md-select v-model="selectedLetters" name="letters" id="letters" multiple>
                  <md-option v-for="letter in letters" v-bind:key="letter" v-bind:value="letter">{{ letter }}</md-option>
                </md-select>
              </md-field>
              <md-button class="md-primary" @click="showAll">Show All</md-button>
              <md-button class="md-primary" @click="hideAll">Hide All</md-button>
            </md-table-toolbar>
            <md-table-row slot="md-table-row" slot-scope="{ item: employee }" :class="getTableRowClass(employee)" md-selectable="single">
              <md-table-cell md-label="Name" md-sort-by="name">{{ getFullName(employee) }}</md-table-cell>
              <md-table-cell md-label="Country" md-sort-by="gender">{{ getCountryName(employee.country) }}</md-table-cell>
              <md-table-cell md-label="Age" md-sort-by="age">{{ employee.age }}</md-table-cell>
            </md-table-row>
          </md-table>
        </div>

      </md-app-content>
    </md-app>
  </div>
</template>

<style lang="scss" scoped>
  .md-app {
    height: 100vh;
    border: 1px solid rgba(#000, .12);

    .md-drawer {
      width: 230px;
      max-width: calc(100vw - 125px);
    }

    .md-avatar.md-large {
      min-width: 200px;
      min-height: 200px;
      border-radius: 100px;
    }

    .employee-avatar:hover {
      border: 3px dashed black;
      cursor: pointer;
    }
  }
</style>

<script>
import { db, storage } from './firebase'
import CountryList from 'country-list'
import { validationMixin } from 'vuelidate'
import {
  required,
  minLength
} from 'vuelidate/lib/validators'

const countryList = CountryList()

const initialFormValues = {
  firstName: null,
  lastName: null,
  age: null,
  country: null,
  pictureURL: null
}

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default {
  name: 'FormValidation',
  mixins: [validationMixin],
  firebase: {
    employees: db.ref('employees')
  },
  data: () => ({
    countries: countryList.getData(),
    form: initialFormValues,
    employeeSaved: false,
    picture: null,
    fileError: false,
    sending: false,
    letters: [...letters],
    selectedLetters: [...letters],
    lastEmployee: null
  }),
  validations: {
    form: {
      id: {
        required: false
      },
      firstName: {
        required,
        minLength: minLength(1)
      },
      lastName: {
        required,
        minLength: minLength(1)
      },
      age: {
        required
      },
      country: {
        required
      }
    }
  },
  methods: {
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    getTableRowClass (employee) {
      return {'md-primary': this.form['.key'] === employee['.key']}
    },
    getAvatarClass () {
      return {'md-large': true, 'employee-avatar': !this.formDisabled}
    },
    getFullName ({ firstName, lastName }) {
      return `${firstName} ${lastName}`
    },
    getCountryName: countryList.getName,
    clearForm () {
      this.$v.$reset()
      this.form = initialFormValues
      this.picture = false
    },
    onSelectEmployee (employee) {
      console.log(this)
      if (!employee) {
        this.clearForm()
      } else {
        this.$v.$reset()
        this.form = {...employee}
      }
    },
    onSelectPicture () {
      if (this.formDisabled) {
        return
      }
      this.fileError = false
      this.$refs.pictureInput.click()
    },
    onPictureSelected (event) {
      const picture = event.target.files[0]

      if (picture.name.lastIndexOf('.') <= 0) {
        this.fileError = true
        return
      }

      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.form.pictureURL = fileReader.result
      })
      fileReader.readAsDataURL(picture)
      this.picture = picture
    },
    showAll () {
      this.selectedLetters = letters
    },
    hideAll () {
      this.selectedLetters = []
    },
    saveEmployee () {
      const newEmployee = {...this.form}
      this.sending = true

      const submit = async () => {
        const key = (await this.$firebaseRefs.employees.push(newEmployee)).key

        if (this.picture) {
          const filename = this.picture.name
          const ext = filename.slice(filename.lastIndexOf('.'))
          const fileRef = storage.ref(`pictures/${key}.${ext}`)
          const snapshot = await fileRef.put(this.picture)
          const pictureURL = await snapshot.ref.getDownloadURL()
          await this.$firebaseRefs.employees.child(key).update({ pictureURL })
        }
      }

      submit()
        .then(() => {
          this.lastEmployee = this.getFullName(newEmployee)
          this.employeeSaved = true
          this.sending = false
          this.clearForm()
        })
        .catch((error) => {
          console.log(error)
          this.sending = false
          this.clearForm()
        })
    },
    validateEmployee () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.saveEmployee()
      }
    }
  },
  computed: {
    formDisabled () {
      return !!this.form['.key'] || this.sending
    },
    filteredEmployee () {
      if (this.selectedLetters.length === 26) {
        return this.employees
      }
      return this.employees.filter(({ firstName }) => this.selectedLetters.indexOf(firstName[0].toUpperCase()) > -1)
    }
  }
}
</script>
