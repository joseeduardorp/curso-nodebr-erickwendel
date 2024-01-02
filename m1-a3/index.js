/*
  Exemplificando o cíclo de vida do NodeJS

  0 - Obter um usuário
  1 - Obter o número de telefone do usuário a partir do seu ID
  2 - Obter o endereço do usuário a partir do seu ID
*/

function obterUsuario(callback) {
	setTimeout(() => {
		return callback(null, {
			id: 1,
			nome: 'Henry Dorsett Case',
			dataNascimento: new Date(),
		});
	}, 1000);
}

function obterTelefone(idUsuario, callback) {
	setTimeout(() => {
		return callback(null, {
			idUsuario,
			telefone: '988776655',
			ddd: 12,
		});
	}, 2000);
}

function obterEndereco(idUsuario, callback) {
	setTimeout(() => {
		return callback(null, {
			idUsuario,
			rua: 'Jules Verne',
			numero: 70,
		});
	}, 2000);
}

obterUsuario((erro, usuario) => {
	if (erro) {
		console.error('Erro ao obter usuário');
		return;
	}

	obterTelefone(usuario.id, (erro1, telefone) => {
		if (erro1) {
			console.error('Erro ao obter telefone');
			return;
		}

		obterEndereco(usuario.id, (erro2, endereco) => {
			if (erro2) {
				console.error('Erro ao obter endereço');
				return;
			}

			console.log(`
        Nome: ${usuario.nome}
        Telefone: (${telefone.ddd}) ${telefone.telefone}
        Endereço: Rua ${endereco.rua}, n${endereco.numero}
      `);
		});
	});
});
