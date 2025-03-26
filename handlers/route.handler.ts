import express, { type Application, type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

/**
 * Carrega dinamicamente um módulo JavaScript, verificando se ele possui um export default.
 *
 * @param {string} filePath - Caminho do módulo que deve ser carregado.
 * @param {'route' | 'middleware'} type - Tipo do módulo (rota ou middleware).
 * @param {string} name - Nome do módulo.
 *
 * @returns {Promise<import(filePath) | null>} Uma promessa que resolve com o export default do módulo, caso o módulo possua um.
 * A promessa resolve com null caso o módulo não possua um export default ou caso uma exceção seja lançada durante o carregamento do módulo.
 */
async function dynamicImport(filePath: string, type: 'route' | 'middleware', name: string) {
    try {
        const module = await import(filePath);
        if (!module.default) {
            console.log(
                chalk.bgRed.white(' ERRO '),
                chalk.red(`O módulo ${type} '${name}' em ${filePath} não possui um export default.`)
            );
            return null;
        }
        return module.default;
    } catch (error) {
        console.log(
            chalk.bgRed.white(' ERRO '),
            chalk.red(`Falha ao carregar o módulo ${type} '${name}':`),
            chalk.yellow(error)
        );
        return null;
    }
}

/**
 * Aplica o status de 'liberada' para a rota especificada.
 *
 * @param {string} routeName - Nome da rota que teve o status alterado.
 * @param {string} routePathName - Caminho da rota que foi liberada.
 * @param {Set<string>} printedRoutes - Conjunto de rotas que já foram exibidas para evitar duplicação.
 *
 * @returns {express.RequestHandler | null} Um middleware que apenas chama o próximo middleware na cadeia.
 */
function applyRouteStatus(routeName: string, routePathName: string, printedRoutes: Set<string>): express.RequestHandler | null {
    if (printedRoutes.has(routePathName)) {
        return (req: Request, res: Response, next: express.NextFunction) => next(); // Se a rota já foi registrada, apenas passa para o próximo middleware
    }

    printedRoutes.add(routePathName);

    console.log(
        chalk.bgGreen.black(' SUCESSO '),
        chalk.white(`Rota [${routePathName}] foi`),
        chalk.green('liberada')+
        chalk.white('.')
    );

    return (req: Request, res: Response, next: express.NextFunction) => next();
}

/**
 * Registra todas as rotas do diretório 'routes' e seus respectivos middleware no aplicativo Express.
 *
 * @param {Application} app - Aplicativo Express.
 *
 * @returns {Promise<void>} Uma promessa que resolve quando todas as rotas forem registradas.
 */
export async function registerRoutes(app: Application): Promise<void> {
    const routesDir = path.join(__dirname, '../routes');
    const middlewareDir = path.join(__dirname, '../middleware');

    const getRouteFiles = (dir: string) => {
        const files = fs.readdirSync(dir);
        let routes: string[] = [];

        files.forEach((file) => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                routes = [...routes, ...getRouteFiles(filePath)];
            } else if (file.endsWith('.route.ts')) {
                routes.push(filePath);
            }
        });

        return routes;
    };

    const routeFiles = getRouteFiles(routesDir);
    const printedRoutes = new Set<string>(); // Armazenará as rotas já exibidas

    for (const filePath of routeFiles) {
        const fileName = path.basename(filePath);
        const routeName = fileName.replace('.route.ts', '');

        let routePathName = path.relative(routesDir, path.dirname(filePath));
        routePathName = routePathName ? `/${routePathName.replace(/\\/g, '/')}/${routeName}` : `/${routeName}`;

        if (routeName === 'default') {
            routePathName = path.relative(routesDir, path.dirname(filePath)) ? `/${path.relative(routesDir, path.dirname(filePath)).replace(/\\/g, '/')}` : '/';
        }

        const routeHandler = await dynamicImport(filePath, 'route', routeName);
        if (!routeHandler) {
            console.log(
                chalk.bgRed.white(' FALHA '),
                chalk.red(`Rota [${routePathName}] não foi registrada.`)
            );
            continue;
        }

        const routeHandlerWithStatus = applyRouteStatus(routeName, routePathName, printedRoutes);
        if (!routeHandlerWithStatus) continue;

        // Carregar o middleware correspondente
        const middlewarePath = path.join(middlewareDir, `app.${routeName}.middleware.ts`);
        const middleware = fs.existsSync(middlewarePath)
            ? await dynamicImport(middlewarePath, 'middleware', routeName)
            : null;

        // Se não houver middleware correspondente, usaremos um middleware padrão
        app.use(routePathName, middleware || ((req, res, next) => next()), routeHandler);
    }

    app.use('/errors', express.static(path.join(__dirname, '../frontend/errors/')));
    app.use((req: Request, res: Response) => {
        res.status(404).sendFile(path.join(__dirname, '../frontend/errors/404/index.html'));
    });
}
