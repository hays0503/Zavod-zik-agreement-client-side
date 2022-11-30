/**
 * Печать замечаний в документ возвращает html
 * @constructor
 * @param {Array} reason - Массив с замечанием по изменению и дополнению документа
 */
export function printReasons(reasons) {
  if (reasons != null && reasons != undefined) {
    return (
      <div className="page">
        <div style={{ paddingLeft: "25px", paddingRight: "30px" }}>
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <h2>
              <b>Замечания</b>
            </h2>
            <b>к договору No_____________ от ____________ 2022г.</b>
          </div>
          <div>
            <ul>
              {reasons.map((reasonsItem) => (
                <>
                  <li>ФИО: {reasonsItem.userFio}&nbsp;</li>
                  <li>Должность: {reasonsItem.userPosition}&nbsp;</li>
                  <li>{reasonsItem.text}&nbsp;</li>
                  <li>&nbsp;</li>
                </>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
