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
                  <h1>Avatar</h1>
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

          <md-table md-card md-fixed-header class="md-layout-item md-size-100" v-model="employees" @md-selected="onSelectEmployee">
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
  }
</style>

<script>
import CountryList from 'country-list'
import { validationMixin } from 'vuelidate'
import {
  required,
  minLength,
  maxLength
} from 'vuelidate/lib/validators'

const countryList = CountryList()

export default {
  name: 'FormValidation',
  mixins: [validationMixin],
  data: () => ({
    countries: countryList.getData(),
    form: {
      id: null,
      firstName: null,
      lastName: null,
      country: null,
      age: null
    },
    employees: [
      {
        id: 1,
        firstName: 'Ukaza',
        lastName: 'Perdana',
        country: 'ID',
        age: 23
      },
      {
        id: 2,
        firstName: 'Stephen',
        lastName: 'Yu',
        country: 'SG',
        age: 23
      },
      {
        id: 3,
        firstName: 'Adrian',
        lastName: 'Rotama',
        country: 'JP',
        age: 23
      }
    ],
    employeeSaved: false,
    sending: false,
    lastEmployee: null
  }),
  validations: {
    form: {
      id: {
        required: false
      },
      firstName: {
        required,
        minLength: minLength(2)
      },
      lastName: {
        required,
        minLength: minLength(2)
      },
      age: {
        required,
        maxLength: maxLength(3)
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
    getTableRowClass ({ id }) {
      return {'md-primary': this.form.id === id}
    },
    getFullName ({ firstName, lastName }) {
      return `${firstName} ${lastName}`
    },
    getCountryName: countryList.getName,
    clearForm () {
      this.$v.$reset()
      this.form.id = null
      this.form.firstName = null
      this.form.lastName = null
      this.form.age = null
      this.form.country = null
    },
    onSelectEmployee (employee) {
      if (!employee) {
        this.clearForm()
      } else {
        this.$v.$reset()
        this.form = {...employee}
      }
    },
    saveEmployee () {
      let newEmployee = {...this.form}
      this.sending = true
      // Instead of this timeout, here you can call your API
      window.setTimeout(() => {
        this.employees.push(newEmployee)
        this.lastEmployee = this.getFullName(newEmployee)
        this.employeeSaved = true
        this.sending = false
        this.clearForm()
      }, 1500)
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
      return this.form.id !== null || this.sending
    }
  }
}
</script>
