const express = require('express');
var jwt = require('jsonwebtoken');
const router = express.Router();
var LdapUser = require('../models/ldapuser')
const {
  Client
} = require('ldapts');

const url = "ldap://192.168.3.250";
const bindDN = "CN=sawangpong,OU=mmc,OU=Project,DC=mrta,DC=co,DC=th";
const password = '1234P@ssw0rd';

const client = new Client({
  url,
});

router.post("/", async (req, res) => {
  const userPrincipalName = req.body.email;
  const cnname = req.body.cnname;
  //const loginbinddn = `CN=${cnname},OU=mmc,OU=Project,DC=mrta,DC=co,DC=th`
  const password = req.body.password

  try {
    await client.bind(userPrincipalName, password);
    //await client.bind(loginbinddn, password);
    isAuthenticated = true;
    // console.log("Authentication success?" + isAuthenticated);
    let token = jwt.sign({
      // username: req.body.loginbinddn
      username: req.body.email
    }, 'secret', {
      expiresIn: '1d'
    });
    return res.status(200).json(token);

  } catch (ex) {
    isAuthenticated = false;
    // console.log("Authentication success?" + isAuthenticated);
    return res.status(500).json({ message: "Please Verify Ldap account" });
  } finally {
    await client.unbind();
  }
});

function LdapToEpoch1(n) {
  var sec = Math.round(n / 10000000);
  sec -= 11644473600;
  var datum = new Date(sec * 1000);
  return datum.toGMTString()
}

const searchDN = "OU=mmc,OU=Project,DC=mrta,DC=co,DC=th";
router.get("/list", async (req, res) => {
  try {
    const bindDN = "sawangpong.mu@mrta.co.th"
    const password = '1234P@ssw0rd';
    await client.bind(bindDN, password);
    const {
      searchEntries,
      searchReferences,
    } = await client.search(searchDN, {
      scope: 'sub',
      filter: "(&(objectClass=person)(objectClass=user))",
    });
    searchEntries.forEach(e => {
      e.lastLogon = LdapToEpoch1(e.lastLogon);
      e.accountExpires = LdapToEpoch1(e.accountExpires);
    })
    //console.log(searchEntries);
    res.send(JSON.stringify(searchEntries));

  } catch (ex) {
    throw ex;
  } finally {
    await client.unbind();
  }
});

router.get('/listldapuser', async (req, res) => {
  try {
    const ldapusers = await LdapUser.find()
    res.status(200).json(ldapusers)
  } catch {
    res.status(500).json({ message: error })
  }
})

router.post('/createldapuser', async (req, res, next) => {

  const ldapuser = new LdapUser({
    email: req.body.email,
    fullname: req.body.fullname,
    role: req.body.role
  })

  try {
    const ldapusersave = await ldapuser.save()
    res.status(200).json(ldapusersave);
  } catch {
    res.status(500).json({ message: err })
  }

})

router.delete('/deleteldapuser/:id', async (req, res) => {
  try {
      const id = req.params.id
      const query = await LdapUser.findByIdAndRemove(id)
      console.log(query)
      res.status(200).json(query)
  } catch (error) {
      res.status(500).json({ message: error })
  }
})
module.exports = router;
