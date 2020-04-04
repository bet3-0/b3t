<template>
  <div class="wrap-login">
    <div class="login-pic" data-tilt>
					<img src="img/logo-BET-france.png" alt="BET 2k20">
		</div>
    <div class="card" style="text-align: center;">
      <div class="card-body">
        <h1 class="card-title">Connexion</h1>
        <p class="card-text">Entre ton identifiant BET !</p>
        <form action="parcours">
          <div class="form-group">
            <label for="idUser">Identifiant :</label>
            <input
              type="text"
              class="form-control"
              id="idUser"
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

<style scoped>

.wrap-login {
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 2rem 1rem 1rem 1rem;
}

.login-pic {
  width: 350px;
  flex-shrink: 1;
}

.login-pic img {
  max-width: 100%;
}


</style>
