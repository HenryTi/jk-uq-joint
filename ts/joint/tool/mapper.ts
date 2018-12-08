export interface MapperBase {
    $import?: 'all';
    [prop:string]: string | boolean | ArrMapper;
}

export interface ArrMapper extends MapperBase {
    $name:string;
}

export interface Mapper extends MapperBase {
    $key: string;
}
