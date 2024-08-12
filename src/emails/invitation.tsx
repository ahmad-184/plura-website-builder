export default function invitationTemplate({
  inviter_name,
  company_name,
  redirect_url,
}: {
  inviter_name: string;
  company_name: string;
  redirect_url: string;
}) {
  return `<html lang="en">
  <body style="background-color: #fff; padding: 48px 32px 48px 32px">
    <td align="left" class="esd-structure es-p30t es-p30b es-p20r es-p20l">
  <table cellpadding="0" cellspacing="0" width="100%">
    <tbody>
      <tr>
        <td width="560" align="center" valign="top" class="esd-container-frame">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tbody>
              <tr>
                <td align="center" class="esd-block-image" style="font-size: 0">
                  <a target="_blank">
                    <img src="https://foisjmq.stripocdn.email/content/guids/CABINET_66565c4e63ec25d450e5b01677f3d8b61c99d16cbd7ada1ac1543e7204aa2c10/images/pluralogo_1.png" alt="" width="100">
                  </a>
                </td>
              </tr>
              <tr>
                <td align="center" class="esd-block-text es-m-txt-c">
                  <h1 style="font-size:46px;margin:0px;">
                    We Invited You
                  </h1>
                </td>
              </tr>
              <tr>
                <td align="center" class="esd-block-text es-p40r es-p40l es-m-p0r es-m-p0l es-p30b">
                  <p style="margin:0px 0px 30px 0px;">
                    ${inviter_name} has invited you to join them on ${company_name}
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" class="esd-block-button es-p10">
                  <span class="es-button-border" style="border-radius: 6px; background: #5376df">
                    <a href="${redirect_url}" target="_blank" class="es-button" style="color:white;text-decoration:none;border-radius: 6px; background: #5376df; mso-border-alt: 10px solid #5376df; font-size: 16px; padding: 15px 60px">
                      Join
                    </a>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</td>
  </body>
</html>
`;
}
