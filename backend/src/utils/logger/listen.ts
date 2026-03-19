import colors from "colors";

// Pegando a data atual
const date = colors.white(
	`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}]`
);

// Formatando mensagem de log
const info = colors.blue("Servidor online rodando na porta:");

const portInfo = (port: number | string) => {
	return colors.red(`${port}`);
};

// Messagem de log para quando o servidor iniciar
const message = (port: number | string) => {
	return console.log(colors.green(`| ${date} --- ${info} ${portInfo(port)} |`));
};

export { message };
