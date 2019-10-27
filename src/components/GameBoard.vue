<template>
  <v-container>
    <v-card>
      <v-card-title>>GameBoard</v-card-title>
      <template>
        <v-container class="grey lighten-5">
          <v-row v-for="n in 5" :key="n" no-gutters>
            <v-col v-for="k in 5" :key="k">
              <v-card class="pa-2" outlined tile>{{ k }} of {{ n + 1 }}</v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-card>
  </v-container>
</template>
