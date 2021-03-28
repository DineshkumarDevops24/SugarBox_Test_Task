let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);


describe('/GET users', () => {

    let token = "";
    let email = "test@gmail.com";
    let password = "testTask@231";
    let newUserId;

    //SignIn before testing other REST API's
    before(function(done) {
        chai.request(server)
          .post('/api/V1/signIn')
          .send({
            "email" : "dinesh@gmail.com",
            "password" : "test@123"
        })
          .end(function(err, res) {
            var result = JSON.parse(res.text);
            token = result.data.token;
            done();
          });
      });

    it('it should GET all the Users', (done) => {
      chai.request(server)
          .get('/api/V1/users?limit=10&page=0')
          .set('Authorization', 'Bearer ' + token)
          .end((err, res) => {
                chai.expect(res.body.data.length).to.be.above(0);
                chai.expect(res).to.have.status(200);
                done();
          });
    });

    it('it should create the user', (done) => {
        chai.request(server)
            .post('/api/V1/user')
            .send({
                "email" : email,
                "password" : password
            })
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                newUserId = res.body.data["_id"];
                chai.expect(res).to.have.status(200);
                chai.expect(res.body.message).to.equals("User created successfully");
                done();
            });
      });

      it('it should user by ID', (done) => {
        chai.request(server)
            .get('/api/V1/user/'+newUserId)
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                console.log(res.body);
                chai.expect(res).to.have.status(200);
                chai.expect(res.body.message).to.equals("User details fetched successfully");
                chai.expect(res.body.data[0].email).to.equals(email);
                done();
            });
      });

      after(function(done) {
        chai.request(server)
          .delete('/api/V1/user/'+newUserId)
          .set('Authorization', 'Bearer ' + token)
          .end(function(err, res) {
            chai.expect(res).to.have.status(200);
            done();
          });
      });

});