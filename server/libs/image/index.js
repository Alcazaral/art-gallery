import path from 'path';
import uuid from 'uuid';
import inspect from 'util-inspect';

const gm = require('gm').subClass({ imageMagick: true });

// const tmpDir = os.tmpdir(); // TODO: Webpack hides tmpdir
const tmpDir = '/tmp';

const debug = require('debug')('app:libs:image');

debug('image temp dir:', tmpDir);

function fitCentered(fitPath, fitSize) {
  return new Promise((resolve, reject) => {
    debug(`fitting image ${fitPath} to size ${inspect(fitSize)}`);

    gm(fitPath).format((err, format) => {
      if (err) {
        reject(err);
        return;
      }

      debug(`image size is ${inspect(format)}`);

      gm(fitPath).size((err, size) => {
        if (err) {
          reject(err);
          return;
        }

        debug(`image type is ${size}`);

        const heightScale = size.height / fitSize.height;
        const widthScale = size.width / fitSize.width;

        const scale = heightScale < widthScale ? heightScale : widthScale;

        debug(`scale ${scale}`);

        const hCenter = size.width / 2;
        const vCenter = size.height / 2;

        debug(`center ${hCenter}, ${vCenter}`);

        const cutPointX = hCenter - ((fitSize.width / 2) * scale);
        const cutPointY = vCenter - ((fitSize.height / 2) * scale);

        debug(`cut points ${cutPointY}, ${cutPointY}`);

        const cutWidth = fitSize.width * scale;
        const cutHeight = fitSize.height * scale;

        debug(`cut area ${cutWidth}, ${cutHeight}`);

        const fitedImageName = uuid.v4();
        const fitedImagePath = `${path.join(tmpDir, fitedImageName)}.${format}`;

        debug(`cropping image with ${cutWidth}+${
          cutHeight}+${cutPointX}+${cutPointY}`);

        gm(fitPath)
          .crop(cutWidth, cutHeight, cutPointX, cutPointY)
          .resize(fitSize.width, fitSize.height)
          .command('convert')

          .write(fitedImagePath, (err) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(fitedImagePath);
          });
      });
    });
  });
}

export { fitCentered };
