import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerController } from 'cerebral';
import { Container } from 'cerebral-view-react';
import fs from 'fs';
import dot from 'dot';
import _ from 'lodash';
import App from '../app/components/App';
import initialState from '../app/initialState';
import { getGames } from './modules/shots/lib/shots';

const isDeveloping = process.env.NODE_ENV === 'development';

const indexDot = fs.readFileSync('./server/index.dot', 'utf-8').toString();
const indexTemplate = dot.template(indexDot);

const getTemplate = () => {
  if (isDeveloping) {
    const freshIndexDot =
      fs.readFileSync('./server/index.dot', 'utf-8').toString();
    return dot.template(freshIndexDot);
  }

  return indexTemplate;
};

export default async function render({ state: newState, ctx }) {
  const user = ctx.state.user;

  // TODO: Enable this line when follow_painters step is complete
  // user = user && user.register_step === 'registered' ? user : null;
  let state = _.merge({}, initialState, { user }, newState);

  // TODO: Cache get games and move it from shots module to another module
  state.config.games = await getGames();

  const controller = new ServerController(state);
  state = JSON.stringify(state, null, 2);

  const htmlBody = renderToString(
    <Container controller={controller}>
      <App />
    </Container>);

  const htmlText = getTemplate()({
    production: !isDeveloping,
    state,
    body: htmlBody,
  });

  ctx.response.type = 'html';
  ctx.response.body = htmlText;
}
