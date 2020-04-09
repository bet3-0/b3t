<template>
  <footer class="footer">
    <div class="container">
      <a target="_blank" href="https://tribu.sgdf.fr/jeunes/">
        <img src="/img/SGDF_SCOUTS_GUIDES_blanc.png"
      /></a>
      <img src="/img/Finistere2.9.png" />
      <img src="/img/clever_cloud_logo_on_dark.png" />
    </div>
    <div class="copyright">
        <span>Conditions d'utilisation</span>
        <span>Copyright © 2020</span>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterComponent",
};
</script>

<style scoped>
img {
  margin-left: 1rem;
  margin-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  max-height: 100%;
  max-width: 100%;
}
.copyright {
  width: 50%;
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  overflow: hidden;
}
span {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 3.1rem;
  font-size: 0.7rem;
  color: white;
  background: var(--header);
  display: flex;
  align-content: center;
  align-items: stretch;
  justify-content: space-around;
}
.container {
  display: inline;
}
</style>
