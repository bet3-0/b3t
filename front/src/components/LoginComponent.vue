<template>
  <div class="container">
    <div class="card" style="margin-top: 20%; text-align: center;">
      <div class="card-body">
        <h5 class="card-title">Connexion</h5>
        <p class="card-text">Entrez vos informations de connexion</p>
        <form action="parcours">
          <div class="form-group">
            <label for="exampleInputEmail1">Nom d'utilisateur</label>
            <input
              type="email"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">Mot de passe</label>
            <input
              type="password"
              class="form-control"
              id="exampleInputPassword1"
            />
          </div>
          <button type="submit" class="btn btn-primary">Se connecter</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginComponent"
};
</script>

<style scoped></style>
