/*
  docker ps
  docker exec -it e555c9711c9a mongo -u admin -p senhaadmin --authenticationDatabase admin

  show dbs -> mostras os bancos de dados
  use heroes -> seleciona um banco de dados
  show collections -> mostra as 'tabelas'
*/

// ======================= Operações de CRUD ===================================

// CREATE
// insere um novo registro
db.heroes.insert({
	nome: 'Flash',
	poder: 'Velocidade',
	dataNascimento: '1998-01-01',
});

// insere N registros
for (let i = 0; i < 10; i++) {
	db.heroes.insert({
		nome: `Dolly-${i}`,
		poder: 'Clonagem',
		dataNascimento: '1996-07-05',
	});
}

// -----------------------------------------------------------------------------

// READ
// retorna todos os registros do banco heroes
db.heroes.find();

// retorna apenas um registro
db.heroes.findOne();

// limita o retorno para 5 registros e inverte a ordem de listagem
db.heroes.find().limit(5).sort({ nome: -1 });

// retorna a 'coluna' poder e sem o _id
db.heroes.find({}, { poder: 1, _id: 0 });

// retorna todos os registros do banco 'heroes' formatados
db.heroes.find().pretty();

// retorna quantos registros uma collection tem
db.heroes.count();

// -----------------------------------------------------------------------------

// UPDATE
// atualiza o registro inteiro
db.heroes.update(
	{ _id: ObjectId('65a6e6f41df20ea8a132452f') },
	{ nome: 'Mulher Maravilha' }
);

// atualiza apenas o campo informado
// se o campo passado não existir, ele será criado
db.heroes.update(
	{ _id: ObjectId('65a6e8331df20ea8a1324538') },
	{ $set: { name: 'Lanterna Verde' } } // o campo 'name' não existe
);

// atualiza apenas o primeiro registro que encontrar com o poder 'Clonagem'
db.heroes.update({ poder: 'Clonagem' }, { $set: { poder: 'Imitar' } });

// -----------------------------------------------------------------------------

// DELETE
// remove todos os registros
db.heroes.remove({});

// remove apenas os registros com name
db.heroes.remove({ nome: 'Mulher Maravilha' });
