import styles from './styles';

export default function HTMLContent ({title, content, footer}) {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Wepass - administracion de condominios</title>
    ${styles.globalStyles}
    </head>
  <body>
  <table class="body-wrap">
    <tr>
      <td></td>
      <td class="container" width="600">
        <div class="content">
          <table class="main" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td class="content-wrap">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td class="content-block">
                      ${title}
                    </td>
                  </tr>
                  <tr>
                    <td class="content-block">
                      ${content}
                    </td>
                  </tr>
                  <tr>
                    <td class="content-block">
                      ${footer}
                    </td>
                  </tr>
                  <tr>
                    <td class="content-block">
                      &mdash; El equipo wepass
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <div class="footer">
            <table width="100%">
              <tr>
                <td class="aligncenter content-block">Siguenos <a href="https://www.instagram.com/wepass.io">@wepass.io</a> en instagram.</td>
              </tr>
            </table>
          </div></div>
      </td>
      <td></td>
    </tr>
  </table>

  </body>
  </html>`;
}
