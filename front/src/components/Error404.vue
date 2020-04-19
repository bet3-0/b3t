<template>
  <div class="wrap-login">
    <div class="login-pic" data-tilt>
      <img src="@/assets/img/billy.png" alt="Billy" />
    </div>
    <div style="text-align: center;">
      <h1>Oups !<br />Il semblerait que cette page n'existe pas !</h1>
      <a href="/">
        <button class="btn btn-primary">Retourner sur la page d'accueil</button>
      </a>
    </div>
  </div>
</template>
<script></script>

<style scoped>
.wrap-login {
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
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
