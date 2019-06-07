$('document').ready(() => {
  const linkedin_rdr = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86m7vxpm3x94qi&redirect_uri=${window.location.origin}/onboarding.html&state=987654321&scope=r_liteprofile,r_emailaddress`
  $('#linkedin_rdr_url').attr('href', linkedin_rdr);
})
