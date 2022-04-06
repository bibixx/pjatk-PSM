const constructRow = (heading: string, data: string[]) => {
  const $columns = data.map((dataValue) => {
    const $td = document.createElement("td");
    $td.textContent = dataValue;

    return $td;
  });

  const $row = document.createElement("tr");

  const $headingTd = document.createElement("th");
  $headingTd.innerHTML = heading;
  $row.appendChild($headingTd);

  $columns.forEach(($td) => {
    $row.appendChild($td);
  });

  return $row;
};

type D = { data: number[]; label: string };

export const updateTable = ($table: Element, heading: string, ...datas: D[]) => {
  $table.textContent = "";
  const $thead = document.createElement("thead");
  $thead.innerHTML = `<tr><th colspan="${datas[0].data.length + 1}">${heading}</th></tr>`;

  const $tbody = document.createElement("tbody");

  for (const { data, label } of datas) {
    const $row = constructRow(
      label,
      data.map((v) => v.toFixed(3))
    );

    $tbody.appendChild($row);
  }

  $table.appendChild($thead);
  $table.appendChild($tbody);
};
