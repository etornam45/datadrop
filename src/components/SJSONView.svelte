<script lang="ts">
  type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

  export let data: Record<string, JSONValue | unknown>;

  function isObject(item: unknown): item is Record<string, unknown> {
    return item !== null && typeof item === 'object' && !Array.isArray(item);
  }

  function isArrayOfObjects(arr: unknown): arr is Record<string, unknown>[] {
    return Array.isArray(arr) && arr.length > 0 && isObject(arr[0]);
  }
</script>

<div class="object-json-visualizer">
  <table class="main-table">
    <thead>
      <tr>
        <th>Key</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      {#each Object.entries(data) as [key, value]}
        <tr>
          <td>{key}</td>
          <td>
            {#if isObject(value) || Array.isArray(value)}
              {Array.isArray(value) ? 'Array' : 'Object'}
            {:else}
              {value}
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  {#each Object.entries(data) as [key, value]}
    {#if isObject(value) || Array.isArray(value)}
      <div class="nested-structure">
        <h3 class="font-semibold p-2 capitalize">{key}</h3>
        {#if isArrayOfObjects(value)}
          <table>
            <thead>
              <tr>
                {#each Object.keys(value[0]) as header}
                  <th>{header}</th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each value as item}
                <tr>
                  {#each Object.values(item) as cellValue}
                    <td>{cellValue}</td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        {:else if Array.isArray(value)}
          <ul>
            {#each value as item}
              <li>{item}</li>
            {/each}
          </ul>
        {:else if isObject(value)}
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {#each Object.entries(value) as [subKey, subValue]}
                <tr>
                  <td>{subKey}</td>
                  <td>{subValue}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      </div>
    {/if}
  {/each}
</div>

<style>
  .object-json-visualizer {
    font-family: "Epilogue";
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 1em;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
  }
  .nested-structure {
    margin-top: 1em;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  ul {
    list-style-type: none;
    padding-left: 0;
  }
</style>